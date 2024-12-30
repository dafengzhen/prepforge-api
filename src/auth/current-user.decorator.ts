import type { ExecutionContext } from '@nestjs/common';

import { createParamDecorator } from '@nestjs/common';

/**
 * CurrentUser.
 *
 * @author dafengzhen
 */
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
