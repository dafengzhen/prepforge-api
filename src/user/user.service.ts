import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthService } from '../auth/auth.service';
import { TCurrentUser } from '../auth/current-user.decorator';
import { AUTHENTICATION_REQUIRED_MESSAGE, EXP_DAYS } from '../constants';
import { LoginDto } from './dto/login.dto';
import { UpdateCustomConfigUserDto } from './dto/update-custom-config-user.dto';
import { CustomConfig } from './entities/custom-config';
import { User } from './entities/user.entity';
import { TokenVo } from './vo/token.vo';

/**
 * UserService.
 *
 * This service handles operations related to users such as login, querying user information,
 * and updating user's custom configuration.
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

  /**
   * Logs a user into the system.
   *
   * Validates the provided username and password. If the user does not exist, creates a new one.
   * Returns a token containing user information and authentication details.
   *
   * @param loginDto - The DTO object containing login credentials (username and password).
   * @returns A promise that resolves to a TokenVo object.
   */
  async login(loginDto: LoginDto): Promise<TokenVo> {
    const username = loginDto.username.trim();
    const password = loginDto.password.trim();

    let user: null | User = await this.userRepository.findOne({ where: { username } });
    let newUser: boolean = false;

    if (user) {
      if (!(await AuthService.isMatchPassword(password, user.password))) {
        throw new UnauthorizedException('Invalid username or password');
      }
    } else {
      user = this.userRepository.create({
        password: await this.authService.encryptPassword(password),
        username,
      });
      user = await this.userRepository.save(user);
      newUser = true;
    }

    return new TokenVo({
      expDays: EXP_DAYS,
      id: user.id,
      newUser,
      token: this.authService.sign(user),
      username: user.username,
    });
  }

  /**
   * Queries for a user by ID.
   *
   * Retrieves user information from the database using the user ID, with caching enabled for performance optimization.
   *
   * @param user - The current authenticated user.
   * @returns A promise that resolves to the found user entity or null if not found.
   */
  async query(user: TCurrentUser): Promise<null | User> {
    return user
      ? this.userRepository.findOne({
          cache: {
            id: `users:${user.id}`,
            milliseconds: 60000,
          },
          where: { id: user.id },
        })
      : null;
  }

  /**
   * Updates the custom configuration for a user.
   *
   * Throws an error if the request is made without proper authentication.
   * Merges existing custom configuration with the new values provided and updates the user record.
   *
   * @param updateCustomConfigUserDto - The DTO object containing the updated configuration data.
   * @param currentUser - The currently authenticated user.
   * @returns A void promise indicating the operation has completed.
   */
  async updateCustomConfig(
    updateCustomConfigUserDto: UpdateCustomConfigUserDto,
    currentUser: TCurrentUser,
  ): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const id = currentUser.id;
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return;
    }

    const updatedCustomConfig: CustomConfig = {
      ...user.customConfig,
      ...updateCustomConfigUserDto,
      type: 'user',
    };

    await this.userRepository.update(id, { customConfig: updatedCustomConfig });
  }
}
