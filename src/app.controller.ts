import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/public-auth.guard';
import { CurrentUser } from './auth/current-user.decorator';
import { User } from './user/entities/user.entity';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

/**
 * AppController.
 *
 * @author dafengzhen
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('health')
  health(): {
    status: 'UP';
  } {
    return this.appService.health();
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @Get('export')
  @UseInterceptors(ClassSerializerInterceptor)
  export(@CurrentUser() user: User) {
    return this.appService.export(user);
  }
}
