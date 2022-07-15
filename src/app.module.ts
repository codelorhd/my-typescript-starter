import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { DatabaseModule } from './database/database.module';

@Module({
  // modules in the application
  // importing a module here instructs nestjs where to get 
  // the controllers and providers (services) for that module
  imports: [PostsModule, ConfigModule.forRoot({
    //ConfigModule reads from the .env file and Joi converts 
    // them to ts datatypes
    validationSchema: Joi.object({
      POSTGRES_HOST: Joi.string().required(),
      POSTGRES_PORT: Joi.number().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DB: Joi.string().required(),
      PORT: Joi.number(),
    })
  }), DatabaseModule],

  // controllers to instantiate
  controllers: [],

  // providers to instantiate - they may be used at least across this module
  providers: [],

  // a subset of providers that are available in other modules
  exports: []
})
export class AppModule { }
