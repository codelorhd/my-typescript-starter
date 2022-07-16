import { IsString, IsUUID } from "class-validator";

export default class FindOneParams {
    // if you use mongodb @IsMongoId() might be useful here
    @IsUUID()
    id: string
}