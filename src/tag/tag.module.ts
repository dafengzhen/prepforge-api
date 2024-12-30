import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { Tab } from '../tab/entities/tab.entity';
import { Tag } from './entities/tag.entity';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

/**
 * TagModule.
 */
@Module({
  controllers: [TagController],
  imports: [AuthModule, TypeOrmModule.forFeature([Tag, Tab])],
  providers: [TagService],
})
export class TagModule {}
