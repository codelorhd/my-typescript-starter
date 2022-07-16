import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { mockedConfigService } from '../../utils/mocks/config.service';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from '../authentication.service';
import { mockedJwtService } from '../../utils/mocks/jwt.service';
import { JwtService } from '@nestjs/jwt';
import mockedUser from './user.mock';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthenticationController } from '../authentication.controller';



// * This tests integration with other services this module depends on

describe('The AuthenticationService', () => {
    let app: INestApplication
    let userData: User

    beforeEach(async () => {
        userData = {
            ...mockedUser
        }
        const usersRepository = {
            create: jest.fn().mockResolvedValue(userData),
            save: jest.fn().mockReturnValue(Promise.resolve())
        }
        const module = await Test.createTestingModule({
            controllers: [AuthenticationController],
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
                    useValue: usersRepository,
                }
            ],
        }).compile();
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


});