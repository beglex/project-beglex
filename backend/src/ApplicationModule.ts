import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {TypeOrmModule} from '@nestjs/typeorm';

import {config} from '@root/configuration';
import * as controllers from '@root/controllers';
import * as entities from '@root/entities';
import * as middleware from '@root/middleware';
import * as services from '@root/services';

const {env, dataSources: {postgres, mongo}} = config;

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: postgres.host,
            port: postgres.port,
            username: postgres.user,
            password: postgres.password,
            database: postgres.database,
            logging: env === 'development',
            synchronize: true,
            entities: Object.values(entities),
        }),
        TypeOrmModule.forFeature(Object.values(entities)),
        MongooseModule.forRoot(
            `mongodb://${mongo.user}:${mongo.password}@${mongo.host}:${mongo.port}/${mongo.database}`),
    ],
    controllers: Object.values(controllers),
    providers: Object.values(services),
})
export class ApplicationModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(middleware.LoggerMiddleware)
            .forRoutes('*');

        consumer.apply(middleware.AuthenticationMiddleware)
            .exclude(
                {path: '/api/users/signin', method: RequestMethod.POST},
                {path: '/api/users/signup', method: RequestMethod.POST},
            )
            .forRoutes('*');
    }
}
