import type {NestExpressApplication} from '@nestjs/platform-express';
import type {Response} from 'supertest';

import {IncomingHttpHeaders, IncomingMessage} from 'node:http';

import {HttpStatus, UnauthorizedException, ValidationPipe} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import {parse, serialize} from 'cookie';
import * as request from 'supertest';

import {ApplicationModule} from '@root/ApplicationModule';
import {boot} from '@root/boot';
import {config} from '@root/configuration';
import {User} from '@root/entities';
import {ErrorFilter} from '@root/filters';
import {UserSigninDto} from '@root/types';

type TestResponse = Omit<Response, 'headers'> & Pick<IncomingMessage, 'headers'>;

let application: NestExpressApplication;

export class Tester {
    constructor() {
        beforeAll(async () => this.startApplication());
        afterAll(async () => this.stopApplication());
    }

    private login: User['login'] = '';
    private tokens: Record<User['login'], string> = {};

    get application() {
        return application;
    }

    private async startApplication() {
        const moduleFixture = await Test.createTestingModule({
            imports: [ApplicationModule],
        }).compile();

        application = moduleFixture.createNestApplication();

        application.useGlobalPipes(new ValidationPipe());
        application.useGlobalFilters(new ErrorFilter());

        await boot();

        await application.init();

        try {
            await this.signIn(config.defaultUser.login, config.defaultUser.password);
        } catch (err: any) {
            process.stderr.write(`${err.toString()}\n`);
            process.exit(1);
        }
    }

    private async stopApplication() {
        await application.close();
    }

    private getCookie = (login: User['login']) => serialize('token', this.tokens[login] || '');

    signIn = async (login: User['login'], password: User['password'], headers: IncomingHttpHeaders = {}) => {
        const body: UserSigninDto = {login, password};
        const result = await this.post('/api/users/signin', body, login, headers);
        const {token} = parse(result.headers['set-cookie']?.find(s => s.startsWith('token=')) || '');

        if (result.status !== HttpStatus.CREATED || !token) {
            throw new UnauthorizedException();
        }

        this.login ||= login;
        this.tokens[login] = token;
    };

    get = (
        url: string,
        login = this.login,
        headers: IncomingHttpHeaders = {},
    ): Promise<TestResponse> => {
        const cookie = this.getCookie(login);

        return request(application.getHttpServer()).get(url).set({cookie, ...headers});
    };

    post = (
        url: string,
        body: string | object = '',
        login = this.login,
        headers: IncomingHttpHeaders = {},
    ): Promise<TestResponse> => {
        const cookie = this.getCookie(login);

        return request(application.getHttpServer()).post(url).set({cookie, ...headers}).send(body);
    };

    patch = (
        url: string,
        body: string | object = '',
        login = this.login,
        headers: IncomingHttpHeaders = {},
    ): Promise<TestResponse> => {
        const cookie = this.getCookie(login);

        return request(application.getHttpServer()).patch(url).set({cookie, ...headers}).send(body);
    };

    del = (
        url: string,
        login = this.login,
        headers: IncomingHttpHeaders = {},
    ): Promise<TestResponse> => {
        const cookie = this.getCookie(login);

        return request(application.getHttpServer()).delete(url).set({cookie, ...headers});
    };
}
