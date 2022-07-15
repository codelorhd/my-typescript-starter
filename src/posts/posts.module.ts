import { Module } from '@nestjs/common'
import PostsController from './posts.controller'
import PostService from './posts.service'
import { TypeOrmModule } from '@nestjs/typeorm';
import Post from './post.entity';

@Module({
    // With Repository, we use it to manage entities
    // we will need to inject the entity in our service
    imports: [TypeOrmModule.forFeature([Post])],
    controllers: [PostsController],
    providers: [PostService],
})
export class PostsModule { }