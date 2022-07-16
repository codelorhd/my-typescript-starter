import { ExcludeNullInterceptor } from './utils/excludeNullI.interceptors';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // * Removes undefined or null values from input and output data
  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }))

  // * Enables access to cookie data. this is used as where to store the
  // * bearing token in this project.
  app.use(cookieParser());

  // * enables the use of class-transformer
  app.useGlobalInterceptors(new ClassSerializerInterceptor(
    app.get(Reflector))
  );

  // Do not return null values to the user
  // app.useGlobalInterceptors(new ExcludeNullInterceptor())

  await app.listen(3003);
}
bootstrap();
