import { Request } from 'express';
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import TokenPayload from "../tokenPayload.interface";
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtInCookieStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.cookies?.Authentication
            }]),
            secretOrKey: configService.get('JWT_SECRET')
        })
    }

    async validate(payload: TokenPayload) {
        return this.userService.getById(payload.userId)
    }
}