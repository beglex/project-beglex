import {Injectable, Logger, NestMiddleware, UnauthorizedException} from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
import {parse} from 'cookie';
import {NextFunction} from 'express';
import {JwtPayload, verify} from 'jsonwebtoken';
import {RedisClientType} from 'redis';

import {config} from '@root/configuration';
import {User} from '@root/entities';
import {RedisSource} from '@root/helpers';
import {useApplicationData} from '@root/hooks';
import {UserService} from '@root/services';
import {ApplicationRequest, ApplicationResponse, Environment} from '@root/types';

const {env, session: {secret}} = config;

type AuthenticationPayload = JwtPayload & Pick<User, 'id' | 'login'>;

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
    private logger = new Logger(AuthenticationMiddleware.name);
    private prefix = `authentication`;
    private redis: RedisClientType;

    constructor(
        private readonly userService: UserService,
    ) {
        RedisSource.getSource().then(redis => this.redis = redis);
    }

    async use(
        request: ApplicationRequest,
        _: ApplicationResponse,
        next: NextFunction,
    ) {
        const {token = ''} = parse(request.headers.cookie || '');
        const data = useApplicationData(request);

        const cached = await this.redis.get(`${this.prefix}:${token}`);
        if (cached) {
            data.user = plainToInstance(User, JSON.parse(cached));
            return next();
        }

        let decoded: AuthenticationPayload;
        try {
            decoded = verify(token, secret,
                {ignoreExpiration: env !== Environment.PRODUCTION}) as AuthenticationPayload;
        } catch {
            this.logger.warn(`Wrong token: '${token}'`);
            throw new UnauthorizedException();
        }

        const user = await this.userService.getOne(decoded.id);
        if (!user) {
            this.logger.warn('User not found', {id: decoded.id});
            throw new UnauthorizedException();
        }

        await this.redis.setEx(`${this.prefix}:${token}`, config.session.lifetime / 60, JSON.stringify(user));
        data.user = user;

        return next();
    }
}
