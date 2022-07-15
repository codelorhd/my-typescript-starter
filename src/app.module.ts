import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';

@Module({
  // modules in the application
  // importing a module here instructs nestjs where to get 
  // the controllers and providers (services) for that module
  imports: [PostsModule],

  // controllers to instantiate
  controllers: [],

  // providers to instantiate - they may be used at least across this module
  providers: [],

  // a subset of providers that are available in other modules
  exports: []
})
export class AppModule { }
