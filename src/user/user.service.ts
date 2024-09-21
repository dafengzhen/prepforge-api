import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { EXP_DAYS } from '../constants';
import { TokenVo } from './vo/token.vo';
import { UpdateCustomizationSettingsUserDto } from './dto/update-customization-settings-user.dto';
import { checkUserPermission } from '../common/tool/tool';
import { updateCustomizationSettings } from 'src/common/tool/customization-settings.tool';
import { CustomizationSettings } from './entities/customization-settings';

/**
 * UserService.
 *
 * @author dafengzhen
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async login(loginDto: LoginDto): Promise<TokenVo> {
    const username = loginDto.username.trim();
    const password = loginDto.password.trim();

    let _user: User;

    if (
      await this.userRepository.exists({
        where: { username },
      })
    ) {
      const user = await this.userRepository.findOneOrFail({
        where: { username },
      });
      if (await AuthService.isMatchPassword(password, user.password)) {
        _user = user;
      } else {
        throw new UnauthorizedException('Invalid username or password');
      }
    } else {
      const user = new User();
      user.username = username;
      user.password = await this.authService.encryptPassword(password);
      _user = await this.userRepository.save(user);
    }

    return new TokenVo({
      id: _user.id,
      username: _user.username,
      token: await this.authService.getTokenForUser(_user),
      expDays: EXP_DAYS,
    });
  }

  async getProfile(currentUser?: User): Promise<User | undefined> {
    if (currentUser) {
      return this.userRepository.findOneByOrFail({
        id: currentUser.id,
      });
    }
  }

  async updateCustomizationSettings(
    id: number,
    currentUser: User,
    updateCustomizationSettingsUserDto: UpdateCustomizationSettingsUserDto,
  ): Promise<void> {
    checkUserPermission(id, currentUser.id);

    const user = await this.userRepository.findOneByOrFail({
      id,
    });

    user.customizationSettings = updateCustomizationSettings(
      'user',
      user.customizationSettings,
      updateCustomizationSettingsUserDto,
    ) as CustomizationSettings;

    await this.userRepository.save(user);
  }
}
