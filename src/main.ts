// noinspection JSIgnoredPromiseFromCall

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { XPoweredByInterceptor } from './interceptor/xpoweredby.interceptor';
import { NoEmptyInterceptor } from './interceptor/noempty.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * bootstrap.
 *
 * @author dafengzhen
 */
async function bootstrap() {
  let cors: boolean | CorsOptions | CorsOptionsDelegate<any>;
  const corsOrigin = process.env.CORS_ORIGIN;
  if (typeof corsOrigin === 'string' && corsOrigin !== '') {
    cors = {
      origin: corsOrigin.split(','),
      credentials: true,
    };
  } else {
    cors = true;
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    cors,
  });
  app.useGlobalInterceptors(
    new NoEmptyInterceptor(),
    process.env.POWERED_BY_HEADER === 'true'
      ? new XPoweredByInterceptor('prepforge')
      : null,
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: true,
    }),
  );
  app.useBodyParser('json', { limit: '16mb' });
  app.useBodyParser('urlencoded', { limit: '16mb', extended: true });
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Prep Forge')
    .setDescription(
      'The repository mainly provides API services for the projects of the [prepforge](https://github.com/dafengzhen/prepforge) repository',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    jsonDocumentUrl: 'swagger/json',
    yamlDocumentUrl: 'swagger/yaml',
  });

  await app.listen(8080);
}

bootstrap();
