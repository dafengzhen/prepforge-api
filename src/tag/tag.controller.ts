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
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { TagService } from './tag.service';
import { UpdateCustomizationSettingsTagDto } from './dto/update-customization-settings-tag.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Tag } from './entities/tag.entity';
import { Question } from '../question/entities/question.entity';

/**
 * TagController.
 *
 * @author dafengzhen
 */
@ApiTags('tags')
@ApiBearerAuth()
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(@CurrentUser() user: User, @Body() createTagDto: CreateTagDto) {
    return this.tagService.create(user, createTagDto);
  }

  @ApiOkResponse({ type: [Tag] })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@CurrentUser() user: User) {
    return this.tagService.findAll(user);
  }

  @ApiOkResponse({ type: Tag })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id: number, @CurrentUser() user: User) {
    return this.tagService.findOne(+id, user);
  }

  @ApiOkResponse({ type: [Question] })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @Get(':id/questions')
  @UseInterceptors(ClassSerializerInterceptor)
  findQuestionsById(@Param('id') id: number, @CurrentUser() user: User) {
    return this.tagService.findQuestionsById(+id, user);
  }

  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.update(+id, user, updateTagDto);
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
    updateCustomizationSettingsTagDto: UpdateCustomizationSettingsTagDto,
  ) {
    return this.tagService.updateCustomizationSettings(
      id,
      user,
      updateCustomizationSettingsTagDto,
    );
  }
}
