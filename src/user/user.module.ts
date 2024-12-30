import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

/**
 * UserModule.
 *
 * @author dafengzhen
 */
@Module({
  controllers: [UserController],
  imports: [AuthModule, TypeOrmModule.forFeature([User])],
  providers: [UserService],
})
export class UserModule {}
