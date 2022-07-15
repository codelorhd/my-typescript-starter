import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { LocalStrategy } from "./strategies/local.strategy";
import { AuthenticationService } from "./authentication.service";
import { UserModule } from "src/users/users.module";
import { AuthenticationController } from './authentication.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from "@nestjs/jwt";
import { JwtInCookieStrategy } from './strategies/jwt.cookie.strategy';

@Module({
    imports: [
        UserModule, PassportModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
                }
            })
        })
    ],
    providers: [AuthenticationService, LocalStrategy, JwtInCookieStrategy],
    controllers: [AuthenticationController]
})
export class AuthenticationModule { }