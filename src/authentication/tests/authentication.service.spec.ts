import { AuthenticationService } from '../authentication.service';
import { Test } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { mockedConfigService } from '../../utils/mocks/config.service';
import { ConfigService } from '@nestjs/config';
import { mockedJwtService } from '../../utils/mocks/jwt.service';
import { JwtService } from '@nestjs/jwt';

describe('The AuthenticationService', () => {
    let authenticationService: AuthenticationService;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsersService,
                AuthenticationService,
                {
                    provide: ConfigService,
                    useValue: mockedConfigService,
                },
                {
                    provide: JwtService,
                    useValue: mockedJwtService
                },
                {
                    provide: getRepositoryToken(User),
                    // mocked repository
                    useValue: {},
                }
            ],
        }).compile();
        authenticationService = await module.get<AuthenticationService>(AuthenticationService);
    })
    describe('when creating a cookie', () => {
        it('should return a string', () => {
            const userId = "1";
            expect(
                typeof authenticationService.getBearerToken(userId)
            ).toEqual('string')
        })
    })
});