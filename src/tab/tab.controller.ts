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
import { Tag } from '../tag/entities/tag.entity';
import { User } from '../user/entities/user.entity';
import { CreateTabDto } from './dto/create-tab.dto';
import { UpdateCustomizationSettingsTabDto } from './dto/update-customization-settings-tab.dto';
import { UpdateTabDto } from './dto/update-tab.dto';
import { Tab } from './entities/tab.entity';
import { TabService } from './tab.service';

/**
 * TabController.
 *
 * @author dafengzhen
 */
@ApiBearerAuth()
@ApiTags('tabs')
@Controller('tabs')
export class TabController {
  constructor(private readonly tabService: TabService) {}

  @ApiForbiddenResponse()
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post()
  async create(@CurrentUser() user: User, @Body() createTabDto: CreateTabDto) {
    return this.tabService.create(user, createTabDto);
  }

  @ApiForbiddenResponse()
  @ApiOkResponse({ type: [Tab] })
  @ApiUnauthorizedResponse()
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@CurrentUser() user: User) {
    return this.tabService.findAll(user);
  }

  @ApiForbiddenResponse()
  @ApiOkResponse({ type: Tab })
  @ApiUnauthorizedResponse()
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id: number, @CurrentUser() user: User) {
    return this.tabService.findOne(+id, user);
  }

  @ApiForbiddenResponse()
  @ApiOkResponse({ type: [Question] })
  @ApiUnauthorizedResponse()
  @Get(':id/questions')
  @UseInterceptors(ClassSerializerInterceptor)
  findQuestionsById(@Param('id') id: number, @CurrentUser() user: User) {
    return this.tabService.findQuestionsById(+id, user);
  }

  @ApiForbiddenResponse()
  @ApiOkResponse({ type: [Tag] })
  @ApiUnauthorizedResponse()
  @Get(':id/tags')
  @UseInterceptors(ClassSerializerInterceptor)
  findTagsById(@Param('id') id: number, @CurrentUser() user: User) {
    return this.tabService.findTagsById(+id, user);
  }

  @ApiForbiddenResponse()
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  update(@Param('id') id: number, @CurrentUser() user: User, @Body() updateTabDto: UpdateTabDto) {
    return this.tabService.update(+id, user, updateTabDto);
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
    updateCustomizationSettingsTabDto: UpdateCustomizationSettingsTabDto,
  ) {
    return this.tabService.updateCustomizationSettings(id, user, updateCustomizationSettingsTabDto);
  }
}
