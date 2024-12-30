import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import databaseConfig from './config/database.config';
import databaseConfigProd from './config/database.config.prod';
import { Question } from './question/entities/question.entity';
import { QuestionModule } from './question/question.module';
import { QuestionService } from './question/question.service';
import { Tab } from './tab/entities/tab.entity';
import { TabModule } from './tab/tab.module';
import { TabService } from './tab/tab.service';
import { Tag } from './tag/entities/tag.entity';
import { TagModule } from './tag/tag.module';
import { TagService } from './tag/tag.service';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';

/**
 * AppModule.
 *
 * @author dafengzhen
 */
@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: process.env.NODE_ENV !== 'production' ? databaseConfig : databaseConfigProd,
    }),
    TypeOrmModule.forFeature([User, Tab, Tag, Question]),
    AuthModule,
    UserModule,
    TabModule,
    TagModule,
    QuestionModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
    UserService,
    TabService,
    TagService,
    QuestionService,
  ],
})
export class AppModule {}
