import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as sanitizeHtml from 'sanitize-html';
import { updateCustomizationSettings } from 'src/common/tool/customization-settings.tool';
import { Repository } from 'typeorm';

import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { IPagination } from '../common/interface/pagination';
import { Paginate } from '../common/tool/pagination';
import { checkUserPermission } from '../common/tool/tool';
import { Tab } from '../tab/entities/tab.entity';
import { Tag } from '../tag/entities/tag.entity';
import { User } from '../user/entities/user.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateCustomizationSettingsQuestionDto } from './dto/update-customization-settings-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CustomizationSettings } from './entities/customization-settings';
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
  ) {}

  async create(currentUser: User, createQuestionDto: CreateQuestionDto) {
    const { answer, question: _question, questions: _questions = [], tabId, tagId } = createQuestionDto;
    const allQuestions = [
      ..._questions,
      ...(typeof _question === 'string' && typeof answer === 'string' ? [{ answer, question: _question }] : []),
    ]
      .filter((item) => item.question !== '' && item.answer !== '')
      .map((item) => {
        const a = sanitizeHtml(item.answer, {
          allowedAttributes: false,
          allowedSchemesByTag: {
            img: ['data'],
          },
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
          nonBooleanAttributes: [],
        });

        return {
          answer: a,
          question: item.question,
        };
      });

    if (allQuestions.length === 0) {
      throw new BadRequestException('Failed to create a question and answer');
    }

    const questions = [];
    for (const item of allQuestions) {
      const question = new Question();
      question.question = item.question;
      question.answer = item.answer;
      question.user = currentUser;

      if (typeof tabId === 'number') {
        const tab = await this.tabRepository.findOne({ where: { id: tabId } });
        if (tab) {
          question.tab = tab;
        }
      }

      if (typeof tagId === 'number') {
        const tag = await this.tagRepository.findOne({ where: { id: tagId } });
        if (tag) {
          question.tag = tag;
        }
      }

      questions.push(question);
    }

    await this.questionRepository.save(questions);
  }

  async findAll(currentUser: User, query?: PaginationQueryDto) {
    const qb = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.tab', 'tab')
      .leftJoinAndSelect('question.tag', 'tag')
      .where('question.user = :userId', { userId: currentUser.id })
      .addOrderBy('question.sort', 'DESC')
      .addOrderBy('question.id', 'DESC');

    let questions: IPagination<Question> | Question[];

    if (
      !query ||
      query.limit === undefined ||
      query.page === undefined ||
      query.offset === undefined ||
      query.size === undefined
    ) {
      questions = await qb.getMany();
    } else {
      questions = await Paginate<Question>(qb, query);
    }

    return questions;
  }

  async findOne(id: number, currentUser: User) {
    return this.questionRepository.findOneOrFail({
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
    });
  }

  async update(id: number, currentUser: User, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.questionRepository.findOneOrFail({
      relations: ['tab', 'tag'],
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
    });

    const { answer, question: _question, sort, tabId, tagId } = updateQuestionDto;

    if (_question === question.question && answer === question.answer && sort === question.sort) {
      return;
    }

    const trimmedQuestion = _question?.trim();
    if (trimmedQuestion) {
      question.question = trimmedQuestion;
    }

    const trimmedAnswer = answer?.trim();
    if (trimmedAnswer) {
      question.answer = sanitizeHtml(trimmedAnswer, {
        allowedAttributes: false,
        allowedSchemesByTag: {
          img: ['data'],
        },
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        nonBooleanAttributes: [],
      });
    }

    if (typeof sort === 'number') {
      question.sort = sort;
    }

    if (typeof tabId === 'number' && tabId !== question.tab?.id) {
      const tab = await this.tabRepository.findOne({ where: { id: tabId } });
      if (tab) {
        question.tab = tab;
      }
    }

    if (typeof tagId === 'number' && tagId !== question.tag?.id) {
      const tag = await this.tagRepository.findOne({ where: { id: tagId } });
      if (tag) {
        question.tag = tag;
      }
    }

    await this.questionRepository.save(question);
  }

  async updateCustomizationSettings(
    id: number,
    currentUser: User,
    updateCustomizationSettingsQuestionDto: UpdateCustomizationSettingsQuestionDto,
  ) {
    checkUserPermission(id, currentUser.id);

    const question = await this.questionRepository.findOneByOrFail({
      id,
    });

    question.customizationSettings = updateCustomizationSettings(
      'question',
      question.customizationSettings,
      updateCustomizationSettingsQuestionDto,
    ) as CustomizationSettings;

    await this.questionRepository.save(question);
  }
}
