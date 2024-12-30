import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { updateCustomizationSettings } from 'src/common/tool/customization-settings.tool';
import { Repository } from 'typeorm';

import { AuthService } from '../auth/auth.service';
import { checkUserPermission } from '../common/tool/tool';
import { EXP_DAYS } from '../constants';
import { LoginDto } from './dto/login.dto';
import { UpdateCustomizationSettingsUserDto } from './dto/update-customization-settings-user.dto';
import { CustomizationSettings } from './entities/customization-settings';
import { User } from './entities/user.entity';
import { TokenVo } from './vo/token.vo';

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

  async getProfile(currentUser?: User): Promise<undefined | User> {
    if (currentUser) {
      return this.userRepository.findOneByOrFail({
        id: currentUser.id,
      });
    }
  }

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
      expDays: EXP_DAYS,
      id: _user.id,
      token: await this.authService.getTokenForUser(_user),
      username: _user.username,
    });
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
