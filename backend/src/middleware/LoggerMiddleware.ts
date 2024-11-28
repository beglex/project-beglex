import {Injectable, Logger, NestMiddleware} from '@nestjs/common';
import {NextFunction} from 'express';
import {UAParser} from 'ua-parser-js';

import {ApplicationRequest, ApplicationResponse} from '@root/types';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger(LoggerMiddleware.name);

    use(
        request: ApplicationRequest,
        response: ApplicationResponse,
        next: NextFunction,
    ) {
        const url = request.originalUrl || request.baseUrl || request.url;
        const {browser, os, ua} = UAParser(request.get('user-agent') || '');
        const userAgent = os.name && browser.name ? `${os}, ${browser}` : ua;

        response.on('close', () =>
            this.logger.verbose(`[${request.ip}] ${request.method} ${url} ${response.statusCode} - ${userAgent}`));

        return next();
    }
}
