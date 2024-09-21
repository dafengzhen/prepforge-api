import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Question } from './entities/question.entity';
import { Tab } from '../tab/entities/tab.entity';
import { Tag } from '../tag/entities/tag.entity';

/**
 * QuestionModule.
 */
@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Question, Tab, Tag])],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
