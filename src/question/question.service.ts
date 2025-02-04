import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { TCurrentUser } from '../auth/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { IPagination } from '../common/interface/pagination';
import { Paginate, sanitizeContent } from '../common/tool/tool';
import { AUTHENTICATION_REQUIRED_MESSAGE } from '../constants';
import { Tab } from '../tab/entities/tab.entity';
import { Tag } from '../tag/entities/tag.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateCustomConfigQuestionDto } from './dto/update-custom-config-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CustomConfig } from './entities/custom-config';
import { Question } from './entities/question.entity';

/**
 * QuestionService.
 *
 * @author dafengzhen
 */
@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Tab)
    private readonly tabRepository: Repository<Tab>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly entityManager: EntityManager,
  ) {}

  /**
   * Creates new Questions based on the provided DTO and associates them with the current user, optionally linking to a Tab or Tag.
   *
   * Validates the input data and creates one or more Questions for the authenticated user. Optionally links each Question to specified Tab or Tag.
   * Throws UnauthorizedException if no user is authenticated.
   *
   * @param createQuestionDto - Data transfer object containing information about the new Questions.
   * @param currentUser - The currently authenticated user.
   */
  async create(createQuestionDto: CreateQuestionDto, currentUser: TCurrentUser): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const { answer, question: _question, questions: _questions = [], tabId, tagId } = createQuestionDto;

    const allQuestions = [..._questions, ...(_question && answer ? [{ answer, question: _question }] : [])]
      .map((item) => ({
        answer: item.answer ? sanitizeContent(item.answer.trim()) : null,
        question: item.question?.trim(),
      }))
      .filter((item) => item.question && item.answer);

    if (allQuestions.length === 0) {
      return;
    }

    const tab = tabId ? await this.tabRepository.findOne({ where: { id: tabId, user: { id: currentUser.id } } }) : null;
    const tag = tagId ? await this.tagRepository.findOne({ where: { id: tagId, user: { id: currentUser.id } } }) : null;

    const questions = allQuestions.map(({ answer, question }) => {
      const newQuestion = new Question();
      newQuestion.question = question!;
      newQuestion.answer = answer!;
      newQuestion.user = currentUser;
      if (tab) {
        newQuestion.tab = tab;
      }
      if (tag) {
        newQuestion.tag = tag;
      }
      return newQuestion;
    });

    await this.questionRepository.save(questions);
  }

  /**
   * Retrieves all Questions associated with the authenticated user, optionally paginated.
   *
   * Returns a list of Questions sorted by sort order and then by ID in descending order. Also includes associated Tabs and Tags.
   * If pagination parameters are provided and valid, returns paginated results.
   * Throws UnauthorizedException if no user is authenticated.
   *
   * @param dto - Pagination query data transfer object.
   * @param currentUser - The currently authenticated user.
   * @returns A promise resolving to an array of Questions or a paginated result set.
   */
  async findAll(dto: PaginationQueryDto, currentUser: TCurrentUser): Promise<IPagination<Question> | Question[]> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const qb = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.tab', 'tab')
      .leftJoinAndSelect('question.tag', 'tag')
      .where('question.user = :userId', { userId: currentUser.id })
      .addOrderBy('question.sort', 'DESC')
      .addOrderBy('question.id', 'DESC');

    if (Object.values(dto).every((value) => typeof value === 'number')) {
      return Paginate<Question>(dto, qb);
    }

    return qb.getMany();
  }

  /**
   * Finds a specific Question by ID for the authenticated user.
   *
   * Throws NotFoundException if the Question does not exist or UnauthorizedException if no user is authenticated.
   *
   * @param id - The ID of the Question to find.
   * @param currentUser - The currently authenticated user.
   * @returns A promise resolving to the found Question.
   */
  async findOne(id: number, currentUser: TCurrentUser): Promise<Question> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const question = await this.questionRepository.findOne({
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return question;
  }

  /**
   * Removes a question entity associated with the given ID and the current user.
   *
   * This function performs the following steps:
   * 1. Checks if the current user is authenticated. If not, throws an UnauthorizedException.
   * 2. Initiates a transaction to ensure atomicity of the operation.
   * 3. Finds the question entity associated with the provided ID and the current user.
   * 4. If the question exists, removes it from the database.
   *
   * @param id - The ID of the question to be removed.
   * @param currentUser - The currently authenticated user.
   * @throws {UnauthorizedException} - If the current user is not authenticated.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async remove(id: number, currentUser: TCurrentUser): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    await this.entityManager.transaction(async (manager) => {
      const question = await manager.findOne(Question, {
        where: {
          id,
          user: {
            id: currentUser.id,
          },
        },
      });

      if (question) {
        await manager.remove(Question, question);
      }
    });
  }

  /**
   * Updates an existing Question identified by ID with new data provided in the DTO.
   *
   * Throws UnauthorizedException if no user is authenticated or NotFoundException if the Question does not exist.
   * Updates the question text, answer, sort order, and/or associated Tab/Tag based on the provided DTO.
   *
   * @param id - The ID of the Question to update.
   * @param updateQuestionDto - Data transfer object containing updated information about the Question.
   * @param currentUser - The currently authenticated user.
   */
  async update(id: number, updateQuestionDto: UpdateQuestionDto, currentUser: TCurrentUser): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const question = await this.questionRepository.findOne({
      relations: ['tab', 'tag'],
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const { answer, question: _question, sort, tabId, tagId } = updateQuestionDto;

    if (_question) {
      question.question = _question.trim();
    }

    if (answer) {
      question.answer = sanitizeContent(answer.trim());
    }

    if (typeof sort === 'number') {
      question.sort = sort;
    }

    if (typeof tabId === 'number') {
      const tab = await this.tabRepository.findOne({ where: { id: tabId, user: { id: currentUser.id } } });
      if (tab) {
        question.tab = tab;
      }
    }

    if (typeof tagId === 'number') {
      const tag = await this.tagRepository.findOne({ where: { id: tagId, user: { id: currentUser.id } } });
      if (tag) {
        question.tag = tag;
      }
    }

    await this.questionRepository.save(question);
  }

  /**
   * Updates the custom configuration of a Question identified by ID.
   *
   * Throws UnauthorizedException if no user is authenticated. If the Question does not exist, it simply returns without making changes.
   * Merges the existing custom configuration with the new values provided in the DTO and updates the Question.
   *
   * @param id - The ID of the Question whose custom configuration needs to be updated.
   * @param updateCustomConfigQuestionDto - Data transfer object containing updated custom configuration details.
   * @param currentUser - The currently authenticated user.
   */
  async updateCustomConfig(
    id: number,
    updateCustomConfigQuestionDto: UpdateCustomConfigQuestionDto,
    currentUser: TCurrentUser,
  ): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const user = await this.questionRepository.findOne({ where: { id, user: { id: currentUser.id } } });
    if (!user) {
      return;
    }

    const updatedCustomConfig: CustomConfig = {
      ...user.customConfig,
      ...updateCustomConfigQuestionDto,
      type: 'question',
    };

    await this.questionRepository.update(id, { customConfig: updatedCustomConfig });
  }
}
