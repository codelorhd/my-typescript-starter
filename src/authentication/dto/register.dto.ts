import { IsEmail, isNotEmpty, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(7)
    password: string;


    // address DTO is not here, cascade was set to true in
    // user entity file making it possible to send address alongside
    // why this is so, I do not know as at now.
}

export default RegisterDto;