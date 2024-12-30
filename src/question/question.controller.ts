import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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

import { CurrentUser } from '../auth/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { User } from '../user/entities/user.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateCustomizationSettingsQuestionDto } from './dto/update-customization-settings-question.dto';
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
  async create(@CurrentUser() user: User, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(user, createQuestionDto);
  }

  @ApiForbiddenResponse()
  @ApiOkResponse({ type: [Question] })
  @ApiUnauthorizedResponse()
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@CurrentUser() user: User, @Query() query?: PaginationQueryDto) {
    return this.questionService.findAll(user, query);
  }

  @ApiForbiddenResponse()
  @ApiOkResponse({ type: Question })
  @ApiUnauthorizedResponse()
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id: number, @CurrentUser() user: User) {
    return this.questionService.findOne(+id, user);
  }

  @ApiForbiddenResponse()
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  update(@Param('id') id: number, @CurrentUser() user: User, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(+id, user, updateQuestionDto);
  }

  @ApiForbiddenResponse()
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id/customization-settings')
  updateCustomizationSettings(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @Body()
    updateCustomizationSettingsQuestionDto: UpdateCustomizationSettingsQuestionDto,
  ) {
    return this.questionService.updateCustomizationSettings(id, user, updateCustomizationSettingsQuestionDto);
  }
}
