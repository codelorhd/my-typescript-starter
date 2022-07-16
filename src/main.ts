import { ExcludeNullInterceptor } from './utils/excludeNullI.interceptors';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // * Removes undefined or null values from input and output data
  app.useGlobalPipes(new ValidationPipe({}))

  // Do not return null values to the user
  // ! Must come before the ClassSerializerInterceptor
  // app.useGlobalInterceptors(new ExcludeNullInterceptor())

  // * enables the use of class-transformer
  app.useGlobalInterceptors(new ClassSerializerInterceptor(
    app.get(Reflector))
  );


  await app.listen(3003);
}
bootstrap();
