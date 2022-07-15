import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto'
import { Repository } from 'typeorm';
import Post from './post.entity';

@Injectable()
export default class PostService {
    private lastPostId = 0
    private posts: Post[] = []

    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>
    ) { }

    getAllPosts() {
        return this.postsRepository.find();
    }

    async getPostById(id: number) {
        const post = await this.postsRepository.findOne({ where: { "id": id } });
        if (post) {
            return post;
        }
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
    }

    async replacePost(id: number, post: UpdatePostDto) {
        await this.postsRepository.update(id, post);
        const updatedPost = await this.postsRepository.findOne({ where: { "id": id } });
        if (updatedPost) {
            return updatedPost
        }
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
    }

    async createPost(post: CreatePostDto) {
        const newPost = await this.postsRepository.create(post);
        await this.postsRepository.save(newPost);
        return newPost
    }

    async deletePost(id: number) {
        const deleteResponse = await this.postsRepository.delete(id);
        if (!deleteResponse.affected) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
    }
}