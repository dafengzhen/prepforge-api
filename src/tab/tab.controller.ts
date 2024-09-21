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
import { UpdateCustomizationSettingsTabDto } from './dto/update-customization-settings-tab.dto';
import { TabService } from './tab.service';
import { CreateTabDto } from './dto/create-tab.dto';
import { UpdateTabDto } from './dto/update-tab.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Tab } from './entities/tab.entity';
import { Tag } from '../tag/entities/tag.entity';

/**
 * TabController.
 *
 * @author dafengzhen
 */
@ApiTags('tabs')
@ApiBearerAuth()
@Controller('tabs')
export class TabController {
  constructor(private readonly tabService: TabService) {}

  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(@CurrentUser() user: User, @Body() createTabDto: CreateTabDto) {
    return this.tabService.create(user, createTabDto);
  }

  @ApiOkResponse({ type: [Tab] })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@CurrentUser() user: User) {
    return this.tabService.findAll(user);
  }

  @ApiOkResponse({ type: Tab })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id: number, @CurrentUser() user: User) {
    return this.tabService.findOne(+id, user);
  }

  @ApiOkResponse({ type: [Tag] })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @Get(':id/tags')
  @UseInterceptors(ClassSerializerInterceptor)
  findTagsById(@Param('id') id: number, @CurrentUser() user: User) {
    return this.tabService.findTagsById(+id, user);
  }

  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @Body() updateTabDto: UpdateTabDto,
  ) {
    return this.tabService.update(+id, user, updateTabDto);
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
    updateCustomizationSettingsTabDto: UpdateCustomizationSettingsTabDto,
  ) {
    return this.tabService.updateCustomizationSettings(
      id,
      user,
      updateCustomizationSettingsTabDto,
    );
  }
}
