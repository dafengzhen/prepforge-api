import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { Tab } from './entities/tab.entity';
import { TabController } from './tab.controller';
import { TabService } from './tab.service';

/**
 * TabModule.
 *
 * @author dafengzhen
 */
@Module({
  controllers: [TabController],
  imports: [AuthModule, TypeOrmModule.forFeature([Tab])],
  providers: [TabService],
})
export class TabModule {}
