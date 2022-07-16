import { IsArray, IsString, IsUUID } from "class-validator"

export default class CreatePostDto {
    @IsString()
    content: string

    @IsString()
    title: string

    @IsArray()
    categories: string[]
}