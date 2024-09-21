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
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../auth/public-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from './entities/user.entity';
import { UpdateCustomizationSettingsUserDto } from './dto/update-customization-settings-user.dto';
import { Response as Res } from 'express';
import { getMaxAge, isHttpsSite } from '../common/tool/tool';
import { SECURE_TK, TK } from '../constants';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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

  @ApiOkResponse({ type: TokenVo })
  @Public()
  @Post('login')
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
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: _isHttpsSite,
        maxAge: getMaxAge(vo.expDays),
      })
      .header('Location', `/users/${vo.id}`)
      .send(vo);
  }

  @ApiOkResponse({ type: User })
  @Public()
  @Get('profile')
  @UseInterceptors(ClassSerializerInterceptor)
  getProfile(@CurrentUser() user?: User): Promise<User | undefined> {
    return this.userService.getProfile(user);
  }

  @ApiBearerAuth()
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @Put(':id/customization-settings')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateCustomizationSettings(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @Body()
    updateCustomizationSettingsUserDto: UpdateCustomizationSettingsUserDto,
  ): Promise<void> {
    return this.userService.updateCustomizationSettings(
      id,
      user,
      updateCustomizationSettingsUserDto,
    );
  }
}
