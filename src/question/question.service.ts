import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { User } from '../user/entities/user.entity';
import { checkUserPermission } from '../common/tool/tool';
import { UpdateCustomizationSettingsQuestionDto } from './dto/update-customization-settings-question.dto';
import { updateCustomizationSettings } from 'src/common/tool/customization-settings.tool';
import { CustomizationSettings } from './entities/customization-settings';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { IPagination } from '../common/interface/pagination';
import { Paginate } from '../common/tool/pagination';
import { Tab } from '../tab/entities/tab.entity';
import { Tag } from '../tag/entities/tag.entity';
import * as sanitizeHtml from 'sanitize-html';

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
    const {
      question: _question,
      answer,
      questions: _questions = [],
      tabId,
      tagId,
    } = createQuestionDto;
    const allQuestions = [
      ..._questions,
      ...(typeof _question === 'string' && typeof answer === 'string'
        ? [{ question: _question, answer }]
        : []),
    ]
      .filter((item) => item.question !== '' && item.answer !== '')
      .map((item) => {
        const q = sanitizeHtml(item.question, {
          allowedTags: false,
          allowedAttributes: false,
          allowVulnerableTags: true,
        });

        const a = sanitizeHtml(item.answer, {
          allowedTags: false,
          allowedAttributes: false,
          allowVulnerableTags: true,
        });

        return {
          question: q,
          answer: a,
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

      if (typeof tabId === 'number' && tabId !== -1) {
        const tab = await this.tabRepository.findOne({ where: { id: tabId } });
        if (tab) {
          question.tab = tab;
        }
      }

      if (typeof tagId === 'number' && tagId !== -1) {
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

    let questions: Question[] | IPagination<Question>;

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

  async update(
    id: number,
    currentUser: User,
    updateQuestionDto: UpdateQuestionDto,
  ) {
    const question = await this.questionRepository.findOneOrFail({
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
      relations: ['tab', 'tag'],
    });

    const { question: _question, answer, sort } = updateQuestionDto;

    if (
      _question === question.question &&
      answer === question.answer &&
      sort === question.sort
    ) {
      return;
    }

    const trimmedQuestion = _question?.trim();
    if (trimmedQuestion) {
      question.question = trimmedQuestion;
    }

    const trimmedAnswer = answer?.trim();
    if (trimmedAnswer) {
      question.answer = trimmedAnswer;
    }

    if (typeof sort === 'number') {
      question.sort = sort;
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
