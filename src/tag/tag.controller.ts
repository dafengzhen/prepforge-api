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
import { Question } from '../question/entities/question.entity';
import { User } from '../user/entities/user.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateCustomizationSettingsTagDto } from './dto/update-customization-settings-tag.dto';
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
  async create(@CurrentUser() user: User, @Body() createTagDto: CreateTagDto) {
    return this.tagService.create(user, createTagDto);
  }

  @ApiForbiddenResponse()
  @ApiOkResponse({ type: [Tag] })
  @ApiUnauthorizedResponse()
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@CurrentUser() user: User) {
    return this.tagService.findAll(user);
  }

  @ApiForbiddenResponse()
  @ApiOkResponse({ type: Tag })
  @ApiUnauthorizedResponse()
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id: number, @CurrentUser() user: User) {
    return this.tagService.findOne(+id, user);
  }

  @ApiForbiddenResponse()
  @ApiOkResponse({ type: [Question] })
  @ApiUnauthorizedResponse()
  @Get(':id/questions')
  @UseInterceptors(ClassSerializerInterceptor)
  findQuestionsById(@Param('id') id: number, @CurrentUser() user: User) {
    return this.tagService.findQuestionsById(+id, user);
  }

  @ApiForbiddenResponse()
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  update(@Param('id') id: number, @CurrentUser() user: User, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, user, updateTagDto);
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
    updateCustomizationSettingsTagDto: UpdateCustomizationSettingsTagDto,
  ) {
    return this.tagService.updateCustomizationSettings(id, user, updateCustomizationSettingsTagDto);
  }
}
