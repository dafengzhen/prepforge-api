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
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { QuestionService } from './question.service';
import { UpdateCustomizationSettingsQuestionDto } from './dto/update-customization-settings-question.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Question } from './entities/question.entity';

/**
 * QuestionController.
 *
 * @author dafengzhen
 */
@ApiTags('questions')
@ApiBearerAuth()
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(
    @CurrentUser() user: User,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    return this.questionService.create(user, createQuestionDto);
  }

  @ApiOkResponse({ type: [Question] })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@CurrentUser() user: User, @Query() query?: PaginationQueryDto) {
    return this.questionService.findAll(user, query);
  }

  @ApiOkResponse({ type: Question })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id: number, @CurrentUser() user: User) {
    return this.questionService.findOne(+id, user);
  }

  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.update(+id, user, updateQuestionDto);
  }

  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @Put(':id/customization-settings')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateCustomizationSettings(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @Body()
    updateCustomizationSettingsQuestionDto: UpdateCustomizationSettingsQuestionDto,
  ) {
    return this.questionService.updateCustomizationSettings(
      id,
      user,
      updateCustomizationSettingsQuestionDto,
    );
  }
}
