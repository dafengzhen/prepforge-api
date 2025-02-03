import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
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
import { DynamicValidationOptions } from '../common/pipes/validator-options.decorator';
import { Question } from '../question/entities/question.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateCustomConfigTagDto } from './dto/update-custom-config-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';

/**
 * TagController.
 *
 * @author dafengzhen
 */
@ApiBearerAuth()
@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiForbiddenResponse()
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post()
  async create(@Body() createTagDto: CreateTagDto, @CurrentUser() currentUser: TCurrentUser): Promise<void> {
    return this.tagService.create(createTagDto, currentUser);
  }

  @ApiForbiddenResponse()
  @ApiOkResponse({ type: [Tag] })
  @ApiUnauthorizedResponse()
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@CurrentUser() currentUser: TCurrentUser): Promise<Tag[]> {
    return this.tagService.findAll(currentUser);
  }

  @ApiForbiddenResponse()
  @ApiOkResponse({ type: Tag })
  @ApiUnauthorizedResponse()
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id') id: number, @CurrentUser() currentUser: TCurrentUser): Promise<Tag> {
    return this.tagService.findOne(+id, currentUser);
  }

  @ApiForbiddenResponse()
  @ApiOkResponse({ type: [Question] })
  @ApiUnauthorizedResponse()
  @Get(':id/questions')
  @UseInterceptors(ClassSerializerInterceptor)
  async findQuestionsById(@Param('id') id: number, @CurrentUser() currentUser: TCurrentUser): Promise<Tag> {
    return this.tagService.findQuestionsById(+id, currentUser);
  }

  @ApiForbiddenResponse()
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTagDto: UpdateTagDto,
    @CurrentUser() currentUser: TCurrentUser,
  ): Promise<void> {
    return this.tagService.update(+id, updateTagDto, currentUser);
  }

  @ApiForbiddenResponse()
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/custom-config')
  async updateCustomConfig(
    @Param('id') id: number,
    @DynamicValidationOptions() updateCustomConfigTagDto: UpdateCustomConfigTagDto,
    @CurrentUser() currentUser: TCurrentUser,
  ): Promise<void> {
    return this.tagService.updateCustomConfig(+id, updateCustomConfigTagDto, currentUser);
  }
}
