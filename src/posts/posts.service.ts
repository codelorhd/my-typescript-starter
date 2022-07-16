import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'

import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto'
import { Repository } from 'typeorm';
import Post from './post.entity';
import PostNotFoundException from '../exceptions/postNotFound.exception';
import User from '../users/entities/user.entity';
import CategoryService from '../categories/categories.service';

@Injectable()
export default class PostService {
    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>,
        @Inject(CategoryService)
        private readonly categoriesService: CategoryService
    ) { }

    getAllPosts() {
        // return each post with their author
        return this.postsRepository.find({ relations: ['author', 'categories'] });
    }

    async getPostById(id: string) {
        const post = await this.postsRepository.findOne({ where: { id: id }, relations: ['author', 'categories'] });
        if (post) {
            return post;
        }
        throw new PostNotFoundException(id);
    }

    async updatePost(id: string, post: UpdatePostDto) {
        await this.postsRepository.update(id, post);
        const updatedPost = await this.postsRepository.findOne({ where: { id: id }, relations: ['author', 'categories'] });
        if (updatedPost) {
            return updatedPost
        }
        throw new PostNotFoundException(id)
    }

    async createPost(post: CreatePostDto, user: User) {
        const categories = await this.categoriesService.getCategoriesByIds(post.categories)
        const newPost = await this.postsRepository.create({
            ...post, author: user, categories: categories
        });
        await this.postsRepository.save(newPost);
        return newPost
    }

    async deletePost(id: string) {
        const deleteResponse = await this.postsRepository.delete(id);
        if (!deleteResponse.affected) {
            throw new PostNotFoundException(id)
        }
    }
}