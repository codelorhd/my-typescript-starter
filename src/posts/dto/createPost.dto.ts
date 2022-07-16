import { IsArray, IsString, IsUUID } from "class-validator"
import Category from "src/categories/category.entity"

export default class CreatePostDto {
    @IsString()
    content: string

    @IsString()
    title: string

    @IsArray()
    categories: string[]
}