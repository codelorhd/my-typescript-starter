import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator"

export default class UpdatePostDto {
    @IsNumber()
    @IsOptional()
    id: number

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    content: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title: string
}