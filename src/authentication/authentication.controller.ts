import { Body, Req, Controller, HttpCode, Post, UseGuards, Res, Get, SerializeOptions, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthenticationService } from "./authentication.service";
import { LocalAuthenticationGuard } from './guards/localAuthentication.guard';
import RegisterDto from "./dto/register.dto";
import RequestWithUser from "./requestWithUser.interface";
import JwtAuthenticationGuard from "./guards/jwt-authentication.guard";

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
// * By default, all properties of our entities are exposed.
// * We can change this strategy by providing additional options to 
// * the class-transformer.
// * This will force you to use the Expose() on the entities variables you want
// * to expose to the user
@SerializeOptions({
    strategy: 'excludeAll'
})
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService
    ) { }

    @UseGuards(JwtAuthenticationGuard)
    @Get()
    authentmicatedMe(@Req() request: RequestWithUser) {
        const user = request.user;
        user.password = undefined;
        return user;
    }

    @Post('register')
    async register(@Body() registrationData: RegisterDto) {
        return this.authenticationService.register(registrationData)
    }

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('log-in')
    async login(@Req() request: RequestWithUser, @Res() response: Response) {
        const user = request.user

        // * this will be set to the caller's cookie and they do not need to manage it them 
        // * Might not be useful for cli or api client apps

        const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
        response.set('Set-Cookie', cookie)

        // user.password = undefined;
        return response.send(user)
    }
}