import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import FindOneParams from '../utils/findOneParams';
import RequestWithUser from '../authentication/requestWithUser.interface';
import CategoryService from './categories.service';
import CreateCategoryDTO from './dto/createCategory.dto';
import UpdateCategory from './dto/UpdateCategory.dto';

@Controller('categories')
export default class CategoriesController {
    constructor(
        private readonly categoriesService: CategoryService
    ) { }


    // GET /categories
    @Get()
    async getAllPosts() {
        return await this.categoriesService.getAllCategories();
    }

    // // GET /posts/123
    @Get(':id')
    async getPostById(@Param() { id }: FindOneParams) {
        return this.categoriesService.getCategoryById((id))
    }

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async createCategory(@Body() category: CreateCategoryDTO, @Req() req: RequestWithUser) {
        return await this.categoriesService.createCategory(category);
    }


    @Patch(':id')
    async updateCategory(@Param() { id }: FindOneParams, @Body() category: UpdateCategory) {
        return this.categoriesService.updateCategory(id, category);
    }

    @Delete(':id')
    async deletePost(@Param() { id }: FindOneParams) {
        await this.categoriesService.deleteCategory(id)
    }
}