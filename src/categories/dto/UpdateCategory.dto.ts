import { IsString } from "class-validator"

export default class UpdateCategory {
    @IsString()
    name: string
}