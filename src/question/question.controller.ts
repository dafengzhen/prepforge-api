import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser, TCurrentUser } from '../auth/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { IPagination } from '../common/interface/pagination';
import { DynamicValidationOptions } from '../common/pipes/validator-options.decorator';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateCustomConfigQuestionDto } from './dto/update-custom-config-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { QuestionService } from './question.service';

/**
 * QuestionController.
 *
 * @author dafengzhen
 */
@ApiBearerAuth()
@ApiTags('questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiForbiddenResponse()
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post()
  async create(@Body() createQuestionDto: CreateQuestionDto, @CurrentUser() currentUser: TCurrentUser): Promise<void> {
    return this.questionService.create(createQuestionDto, currentUser);
  }

  @ApiForbiddenResponse()
  @ApiOkResponse({ type: [Question] })
  @ApiUnauthorizedResponse()
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @Query() dto: PaginationQueryDto,
    @CurrentUser() currentUser: TCurrentUser,
  ): Promise<IPagination<Question> | Question[]> {
    return this.questionService.findAll(dto, currentUser);
  }

  @ApiForbiddenResponse()
  @ApiOkResponse({ type: Question })
  @ApiUnauthorizedResponse()
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id') id: number, @CurrentUser() currentUser: TCurrentUser): Promise<Question> {
    return this.questionService.findOne(+id, currentUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number, @CurrentUser() currentUser: TCurrentUser): Promise<void> {
    return this.questionService.remove(+id, currentUser);
  }

  @ApiForbiddenResponse()
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @CurrentUser() currentUser: TCurrentUser,
  ): Promise<void> {
    return this.questionService.update(+id, updateQuestionDto, currentUser);
  }

  @ApiForbiddenResponse()
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/custom-config')
  async updateCustomConfig(
    @Param('id') id: number,
    @DynamicValidationOptions() updateCustomConfigQuestionDto: UpdateCustomConfigQuestionDto,
    @CurrentUser() currentUser: TCurrentUser,
  ): Promise<void> {
    return this.questionService.updateCustomConfig(+id, updateCustomConfigQuestionDto, currentUser);
  }
}
