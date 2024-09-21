import { Injectable } from '@nestjs/common';
import { User } from './user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Tab } from './tab/entities/tab.entity';
import { Repository } from 'typeorm';

/**
 * AppService.
 *
 * @author dafengzhen
 */
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Tab)
    private readonly tabRepository: Repository<Tab>,
  ) {}

  health(): {
    status: 'UP';
  } {
    return {
      status: 'UP',
    };
  }

  async export(currentUser: User) {
    return this.tabRepository
      .createQueryBuilder('tab')
      .leftJoinAndSelect('tab.tags', 'tags')
      .addOrderBy('tags.sort', 'DESC')
      .addOrderBy('tags.id', 'DESC')
      .leftJoinAndSelect('tab.questions', 'questions')
      .addOrderBy('questions.sort', 'DESC')
      .addOrderBy('questions.id', 'DESC')
      .where('tab.user = :userId', { userId: currentUser.id })
      .addOrderBy('tab.sort', 'DESC')
      .addOrderBy('tab.id', 'DESC')
      .getMany();
  }
}
