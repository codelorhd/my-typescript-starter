import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';

import { getRepositoryToken } from '@nestjs/typeorm';
import { mockedConfigService } from '../../utils/mocks/config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationService } from '../authentication.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthenticationController } from '../authentication.controller';
import { JWTFromAuthHeaderStrategy } from '../strategies/jwt.header.strategy';
import { LocalStrategy } from '../strategies/local.strategy';

import User from '../../users/entities/user.entity';
import mockedUser from './user.mock';
import { UsersService } from '../../users/users.service';

// * This tests performs http tests across all the endpoints in the module

describe('The AuthenticationService', () => {
    let app: INestApplication
    let userData: User
    let findUser: jest.Mock


    beforeEach(async () => {
        userData = {
            ...mockedUser
        }
        const usersRepository = {
            create: jest.fn().mockResolvedValue(userData),
            findOne: findUser,
            save: jest.fn().mockReturnValue(Promise.resolve())
        }
        findUser = jest.fn().mockReturnValue(userData)

        const module = await Test.createTestingModule({
            controllers: [AuthenticationController],
            imports: [
                JwtModule.registerAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: async (configService: ConfigService) => ({
                        // * using our own configService to read from our custom env
                        // mockedConfigService instead of configService
                        secret: mockedConfigService.get('JWT_SECRET'),
                        signOptions: {
                            expiresIn: `${mockedConfigService.get('JWT_EXPIRATION_TIME')}s`,
                        }
                    })
                })
            ],
            providers: [
                UsersService,
                AuthenticationService,
                {
                    provide: ConfigService,
                    useValue: mockedConfigService,
                },
                {
                    provide: getRepositoryToken(User),
                    // mocked repository
                    useValue: usersRepository,
                },
                LocalStrategy, JWTFromAuthHeaderStrategy

            ],
        })
            .compile();
        app = module.createNestApplication()
        app.useGlobalPipes(new ValidationPipe())
        await app.init()
    })

    describe('when registering', () => {
        describe('and using valid data', () => {
            it('should respond with the data of the user without password', () => {
                const expectedData = {
                    ...userData
                }
                delete expectedData.password
                return request(app.getHttpServer())
                    .post('/authentication/register')
                    .send({
                        email: mockedUser.email,
                        name: mockedUser.name,
                        password: 'strongPASSWORD'
                    }).expect(201).expect(expectedData)
            })
        })
        describe('and using invalid data', () => {
            it('should throw an error', () => {
                return request(app.getHttpServer())
                    .post('/authentication/register')
                    .send({
                        name: mockedUser.name
                    }).expect(400)
            })
        })
    })


    describe('when singing in', () => {
        let validToken = "";
        describe('and using valid data', () => {
            it('it should return the bearer token', () => {
                return request(app.getHttpServer())
                    .post('/authentication/log-in')
                    .send({
                        email: mockedUser.email,
                        password: 'strongPASSWORD'
                    }).expect(200).expect((data) => {
                        validToken = data.body['access_token']
                    })
            })
        })

        describe('and using valid data', () => {
            it('logged in user should be able to make authenticated request', () => {
                return request(app.getHttpServer())
                    .get('/authentication')
                    .set('Authorization', "Bearer " + validToken)
                    .expect(200)
            })
        })


        describe('and using in valid data', () => {
            it('it should should fail', () => {
                return request(app.getHttpServer())
                    .post('/authentication/log-in')
                    .send({
                        email: mockedUser.email,
                        password: 'invalid-password'
                    }).expect(403).expect((data) => {
                        data.body['access_token']
                    })
            })
        })
    })

});