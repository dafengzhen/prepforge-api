import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TCurrentUser } from './auth/current-user.decorator';
import { AUTHENTICATION_REQUIRED_MESSAGE } from './constants';
import { Tab } from './tab/entities/tab.entity';

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

  /**
   * Exports tabs associated with the current authenticated user.
   *
   * This method retrieves all tabs belonging to the specified user,
   * including their associated tags and questions. The results are
   * ordered by the `sort` and `id` fields in descending order.
   *
   * If the current user is not authenticated, an `UnauthorizedException`
   * is thrown with a predefined authentication required message.
   *
   * @param {TCurrentUser} currentUser - The currently authenticated user.
   * @returns {Promise<Tab[]>} - A promise that resolves to an array of Tab entities.
   * @throws {UnauthorizedException} - Throws an exception if the user is not authenticated.
   */
  async export(currentUser: TCurrentUser): Promise<Tab[]> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

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

  /**
   * Checks the health status of the service.
   *
   * This method returns a simple health check status indicating
   * that the service is up and running.
   *
   * @returns {Promise<{ status: 'UP' }>} - A promise that resolves to an object
   * containing the status of the service.
   */
  async health(): Promise<{
    status: 'UP';
  }> {
    return Promise.resolve({
      status: 'UP',
    });
  }
}
