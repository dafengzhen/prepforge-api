import { ClassSerializerInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AppService } from './app.service';
import { CurrentUser, TCurrentUser } from './auth/current-user.decorator';
import { Public } from './auth/public-auth.guard';
import { Tab } from './tab/entities/tab.entity';

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
  async export(@CurrentUser() currentUser: TCurrentUser): Promise<Tab[]> {
    return this.appService.export(currentUser);
  }

  @Get('health')
  @Public()
  async health(): Promise<{
    status: 'UP';
  }> {
    return this.appService.health();
  }
}
