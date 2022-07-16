import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import CategoriesController from './categories.controller';
import CategoryService from './categories.service';
import Category from './category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    controllers: [CategoriesController],
    providers: [CategoryService],
    exports: [CategoryService]
})
export class CategoriesModule { }
