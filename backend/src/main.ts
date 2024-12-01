import type {NestExpressApplication} from '@nestjs/platform-express';

import {Logger, ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import helmet from 'helmet';

import {ApplicationModule} from '@root/ApplicationModule';
import {boot} from '@root/boot';
import {config} from '@root/configuration';
import {ErrorFilter} from '@root/filters';
import {LoggingInterceptor} from '@root/interceptors';

const {env, host, port, services: {client}} = config;

async function bootstrap() {
    const logger = new Logger(bootstrap.name);
    const application = await NestFactory.create<NestExpressApplication>(ApplicationModule);

    application.enableCors({origin: client.url, credentials: true});
    application.use(helmet());
    application.useGlobalInterceptors(new LoggingInterceptor());
    application.useGlobalPipes(new ValidationPipe({transform: true}));
    application.useGlobalFilters(new ErrorFilter());

    await boot();

    application.listen(port, host, () => {
        logger.log(`Listening at http://${host}:${port}/api/version in ${env} mode`);
    });
}

bootstrap();
