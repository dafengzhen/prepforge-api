import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { Tab } from '../tab/entities/tab.entity';
import { Tag } from '../tag/entities/tag.entity';
import { Question } from './entities/question.entity';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

/**
 * QuestionModule.
 */
@Module({
  controllers: [QuestionController],
  imports: [AuthModule, TypeOrmModule.forFeature([Question, Tab, Tag])],
  providers: [QuestionService],
})
export class QuestionModule {}
