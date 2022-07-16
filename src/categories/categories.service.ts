import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';

import { In, Repository } from 'typeorm';
import Category from './category.entity';
import createCategoryDto from './dto/createCategory.dto';
import CategoryNotFoundException from '../exceptions/notFoundExceptions';
import DuplicateResourceException from '../exceptions/duplicateResource.exception';
import UpdateCategory from './dto/UpdateCategory.dto';

@Injectable()
export default class CategoryService {

    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>
    ) { }


    async getCategoriesByIds(categories: string[]): Promise<Category[]> {
        const returnedCategories = await this.categoriesRepository.find({
            where: { id: In(categories) }
            // order: { createDate: "ASC" }
        })

        if (returnedCategories.length == categories.length) {
            return returnedCategories
        }

        throw new NotFoundException(`Some of the categories you supplied were not found ${categories}`)
    }

    async getAllCategories() {
        // return each post with their posts
        return this.categoriesRepository.find({ relations: ['posts'] });
    }

    async createCategory(category: createCategoryDto) {
        try {
            await this.getCategoryByName(category.name)
            throw new DuplicateResourceException(`There is a category with this name ${category.name}`)
        } catch (e) {
            if (!(e instanceof CategoryNotFoundException)) {
                throw e
            }
        }
        const newCategory = this.categoriesRepository.create({ ...category })
        await this.categoriesRepository.save(newCategory);
        return newCategory
    }

    private async getCategoryByName(name: string) {
        const category = await this.categoriesRepository.findOne({ where: { name: name } })
        if (category) {
            return category
        }
        throw new CategoryNotFoundException(name)
    }

    async updateCategory(id: string, category: UpdateCategory): Promise<Category> {
        const updateResult = await this.categoriesRepository.update(id, category)
        if (!updateResult.affected) {
            throw new CategoryNotFoundException(id)
        }
        return await this.getCategoryById(id);
    }

    async getCategoryById(id: string) {
        const category = await this.categoriesRepository.findOne({ where: { id: id } })
        if (category) {
            return category
        }
        throw new CategoryNotFoundException(id)
    }

    async deleteCategory(id: string) {
        const deleteResponse = await this.categoriesRepository.delete(id)
        if (!deleteResponse.affected) {
            throw new CategoryNotFoundException(id)
        }
    }
}