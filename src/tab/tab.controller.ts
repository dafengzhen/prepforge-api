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
import { Tag } from '../tag/entities/tag.entity';
import { CreateTabDto } from './dto/create-tab.dto';
import { UpdateCustomConfigTabDto } from './dto/update-custom-config-tab.dto';
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
  async create(@Body() createTabDto: CreateTabDto, @CurrentUser() currentUser: TCurrentUser): Promise<void> {
    return this.tabService.create(createTabDto, currentUser);
  }

  @ApiForbiddenResponse()
  @ApiOkResponse({ type: [Tab] })
  @ApiUnauthorizedResponse()
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@CurrentUser() currentUser: TCurrentUser): Promise<Tab[]> {
    return this.tabService.findAll(currentUser);
  }

  @ApiForbiddenResponse()
  @ApiOkResponse({ type: Tab })
  @ApiUnauthorizedResponse()
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id') id: number, @CurrentUser() currentUser: TCurrentUser): Promise<Tab> {
    return this.tabService.findOne(+id, currentUser);
  }

  @ApiForbiddenResponse()
  @ApiOkResponse({ type: [Question] })
  @ApiUnauthorizedResponse()
  @Get(':id/questions')
  @UseInterceptors(ClassSerializerInterceptor)
  async findQuestionsById(@Param('id') id: number, @CurrentUser() currentUser: TCurrentUser): Promise<Tab> {
    return this.tabService.findQuestionsById(+id, currentUser);
  }

  @ApiForbiddenResponse()
  @ApiOkResponse({ type: [Tag] })
  @ApiUnauthorizedResponse()
  @Get(':id/tags')
  @UseInterceptors(ClassSerializerInterceptor)
  async findTagsById(@Param('id') id: number, @CurrentUser() currentUser: TCurrentUser): Promise<Tab> {
    return this.tabService.findTagsById(+id, currentUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number, @CurrentUser() currentUser: TCurrentUser): Promise<void> {
    return this.tabService.remove(+id, currentUser);
  }

  @ApiForbiddenResponse()
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTabDto: UpdateTabDto,
    @CurrentUser() currentUser: TCurrentUser,
  ): Promise<void> {
    return this.tabService.update(+id, updateTabDto, currentUser);
  }

  @ApiForbiddenResponse()
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/custom-config')
  async updateCustomConfig(
    @Param('id') id: number,
    @DynamicValidationOptions() updateCustomConfigTabDto: UpdateCustomConfigTabDto,
    @CurrentUser() currentUser: TCurrentUser,
  ): Promise<void> {
    return this.tabService.updateCustomConfig(+id, updateCustomConfigTabDto, currentUser);
  }
}
