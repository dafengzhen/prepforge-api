import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Tag } from './entities/tag.entity';
import { Tab } from '../tab/entities/tab.entity';

/**
 * TagModule.
 */
@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Tag, Tab])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
