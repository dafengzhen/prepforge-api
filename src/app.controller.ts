import { ClassSerializerInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AppService } from './app.service';
import { CurrentUser } from './auth/current-user.decorator';
import { Public } from './auth/public-auth.guard';
import { User } from './user/entities/user.entity';

/**
 * AppController.
 *
 * @author dafengzhen
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiBearerAuth()
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @Get('export')
  @UseInterceptors(ClassSerializerInterceptor)
  export(@CurrentUser() user: User) {
    return this.appService.export(user);
  }

  @Get('health')
  @Public()
  health(): {
    status: 'UP';
  } {
    return this.appService.health();
  }
}
