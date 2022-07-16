import { IsString, IsNotEmpty, IsOptional, IsUUID } from "class-validator"

export default class UpdatePostDto {
    @IsUUID()
    @IsOptional()
    id: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    content: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title: string
}