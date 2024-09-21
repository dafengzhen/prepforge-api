import { Module } from '@nestjs/common';
import { TabService } from './tab.service';
import { TabController } from './tab.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Tab } from './entities/tab.entity';

/**
 * TabModule.
 *
 * @author dafengzhen
 */
@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Tab])],
  controllers: [TabController],
  providers: [TabService],
})
export class TabModule {}
