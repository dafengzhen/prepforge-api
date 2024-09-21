import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { isHttpsSite } from '../common/tool/tool';
import { AUTHORIZATION, BEARER, SECURE_TK, TK } from '../constants';
import { Request as Req } from 'express';
import { JwtPayload } from 'jsonwebtoken';

/**
 * JwtStrategy.
 *
 * @author dafengzhen
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.TOKEN_SECRET,
    });
  }

  static extractJWT(req: Req): string | null | undefined {
    const key = isHttpsSite() ? SECURE_TK : TK;
    if (typeof req.cookies === 'object') {
      const tk = req.cookies[key];
      if (typeof tk === 'string' && tk.length > 0) {
        return tk;
      }
    }
  }

  static extractAuthHeaderAsBearerToken(req: Req): string | null | undefined {
    const header =
      req.headers[AUTHORIZATION] ?? req.headers[AUTHORIZATION.toLowerCase()];
    const bearer = `${BEARER} `;
    if (
      typeof header === 'string' &&
      header.startsWith(bearer) &&
      header.length > bearer.length * 2
    ) {
      return header;
    }
  }

  async validate(payload: JwtPayload) {
    return this.authService.getUserByIdAndToken(Number(payload.sub));
  }
}
