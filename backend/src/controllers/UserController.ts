import {Body, Controller, Post, Response} from '@nestjs/common';
import {serialize} from 'cookie';

import {config} from '@root/configuration';
import {User} from '@root/entities';
import {UserService} from '@root/services';
import {ApplicationResponse, UserSigninDto, UserSignupDto} from '@root/types';

import {BaseController} from './BaseController';

const {session: {lifetime: maxAge}} = config;

@Controller('/api/users')
export class UserController extends BaseController<User> {
    constructor(
        protected readonly service: UserService,
    ) {
        super(service);
    }

    get Entity() {
        return User;
    }

    @Post('signin')
    async signIn(
        @Body() body: UserSigninDto,
        @Response() response: ApplicationResponse,
    ) {
        const result = await this.service.signIn(body);

        response.removeHeader('Set-Cookie');
        response.header('Set-Cookie', serialize('token', User.sign(result), {maxAge, path: '/', sameSite: 'lax'}));

        response.send(result);
    }

    @Post('signup')
    async signUp(
        @Body() body: UserSignupDto,
        @Response() response: ApplicationResponse,
    ) {
        const result = await this.service.create(body);

        response.removeHeader('Set-Cookie');
        response.header('Set-Cookie', serialize('token', User.sign(result), {maxAge, path: '/', sameSite: 'lax'}));

        response.send(result);
    }
}
