import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import databaseConfigProd from './config/database.config.prod';
import { User } from './user/entities/user.entity';
import { Tab } from './tab/entities/tab.entity';
import { Tag } from './tag/entities/tag.entity';
import { Question } from './question/entities/question.entity';
import { TabModule } from './tab/tab.module';
import { TagModule } from './tag/tag.module';
import { QuestionModule } from './question/question.module';
import { TabService } from './tab/tab.service';
import { TagService } from './tag/tag.service';
import { QuestionService } from './question/question.service';
import { UserService } from './user/user.service';

/**
 * AppModule.
 *
 * @author dafengzhen
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production'
          ? databaseConfig
          : databaseConfigProd,
    }),
    TypeOrmModule.forFeature([User, Tab, Tag, Question]),
    AuthModule,
    UserModule,
    TabModule,
    TagModule,
    QuestionModule,
  ],
  controllers: [AppController],
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
