import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import PostsController from './posts.controller'
import PostService from './posts.service'
import Post from './post.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
    // With Repository, we use it to manage entities
    // we will need to inject the entity in our service
    imports: [CategoriesModule, TypeOrmModule.forFeature([Post])],
    controllers: [PostsController],
    providers: [PostService],
})
export class PostsModule { }