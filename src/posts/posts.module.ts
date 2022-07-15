import { Module } from '@nestjs/common'
import PostsController from './posts.controller'
import PostService from './posts.service'

@Module({
    imports: [],
    controllers: [PostsController],
    providers: [PostService],
})
export class PostsModule { }