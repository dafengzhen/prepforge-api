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
  Response,
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
import { Response as Res } from 'express';

import { CurrentUser } from '../auth/current-user.decorator';
import { Public } from '../auth/public-auth.guard';
import { getMaxAge, isHttpsSite } from '../common/tool/tool';
import { SECURE_TK, TK } from '../constants';
import { LoginDto } from './dto/login.dto';
import { UpdateCustomizationSettingsUserDto } from './dto/update-customization-settings-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { TokenVo } from './vo/token.vo';

/**
 * UserController,
 *
 * @author dafengzhen
 */
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: User })
  @Get('profile')
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  getProfile(@CurrentUser() user?: User): Promise<undefined | User> {
    return this.userService.getProfile(user);
  }

  @ApiOkResponse({ type: TokenVo })
  @Post('login')
  @Public()
  async login(
    @Response() response: Res,
    @Body() loginDto: LoginDto,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
  ): Promise<TokenVo> {
    const vo = await this.userService.login(loginDto);
    const _isHttpsSite = isHttpsSite();
    response
      .cookie(_isHttpsSite ? SECURE_TK : TK, vo.token, {
        httpOnly: true,
        maxAge: getMaxAge(vo.expDays),
        path: '/',
        sameSite: 'strict',
        secure: _isHttpsSite,
      })
      .header('Location', `/users/${vo.id}`)
      .send(vo);
  }

  @ApiBearerAuth()
  @ApiForbiddenResponse()
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id/customization-settings')
  updateCustomizationSettings(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @Body()
    updateCustomizationSettingsUserDto: UpdateCustomizationSettingsUserDto,
  ): Promise<void> {
    return this.userService.updateCustomizationSettings(id, user, updateCustomizationSettingsUserDto);
  }
}
