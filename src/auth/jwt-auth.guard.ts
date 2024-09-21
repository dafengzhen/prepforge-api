import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public-auth.guard';
import { JwtStrategy } from './jwt.strategy';

/**
 * JwtAuthGuard.
 *
 * @author dafengzhen
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest();
    if (
      typeof JwtStrategy.extractJWT(req) === 'string' ||
      typeof JwtStrategy.extractAuthHeaderAsBearerToken(req) === 'string'
    ) {
      return super.canActivate(context);
    }

    return isPublic ? true : super.canActivate(context);
  }
}
