import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';


import RegisterDto from './dto/register.dto';
import User from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { PostgresErrorCode } from './../database/postgresErrorCodes.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import TokenPayload from './tokenPayload.interface';

// TODO: Should be read from the env
const NUMBER_OF_ROUNDS = 10

export class AuthenticationService {
    constructor(
        // * Remember to inject service coming from another module
        @Inject(UsersService)
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    // Clear the token off the cookie
    public getCookieForLogout() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }

    public getCookieWithJwtToken(userId: string) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload)
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

    public getBearerToken(userId: string) {
        const payload: TokenPayload = { userId };
        return this.jwtService.sign(payload)
    }

    public async register(registrationData: RegisterDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(registrationData.password, NUMBER_OF_ROUNDS)

        try {
            const createdUser = await this.usersService.create({
                ...registrationData,
                password: hashedPassword
            });
            createdUser.password = undefined;
            return createdUser
        } catch (error) {
            if (error?.code == PostgresErrorCode.UniqueViolation) {
                throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST)
            }
            throw new HttpException("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async getAuthenticatedUser(email: string, plainTextPassword: string): Promise<User> {
        try {
            const user = await this.usersService.getByEmail(email)
            await this.verifyPassword(plainTextPassword, user.password)
            delete user.password
            return user;
        } catch (error) {
            throw new HttpException('Wrong credentials provided', HttpStatus.FORBIDDEN)
        }
    }

    private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword)
        if (!isPasswordMatching) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST)
        }
    }
}