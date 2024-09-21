import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

/**
 * salt rounds.
 */
const SALT_ROUNDS = 12;

/**
 * AuthService.
 *
 * @author dafengzhen
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public static async isMatchPassword(
    currentPassword: string,
    userPassword: string,
  ) {
    return bcrypt.compare(currentPassword, userPassword);
  }

  async validate(username: string, password: string) {
    const user = await this.userRepository.findOne({ where: { username } });

    if (
      !user ||
      !(await AuthService.isMatchPassword(password, user.password))
    ) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }

  async getTokenForUser(user: User) {
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }

  async getUserByIdAndToken(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async encryptPassword(password: string) {
    return bcrypt.hash(password, SALT_ROUNDS);
  }
}
