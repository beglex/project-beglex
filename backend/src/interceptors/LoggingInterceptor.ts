import {CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor} from '@nestjs/common';
import {Observable, tap} from 'rxjs';

import {ApplicationRequest, ApplicationResponse} from '@root/types';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    prepareQuery(request: ApplicationRequest) {
        if (Object.keys(request.query || {}).length) {
            return JSON.stringify(request.query);
        }

        return '';
    }

    prepareBody(request: ApplicationRequest) {
        if (Object.keys(request.body || {}).length) {
            return JSON.stringify(request.body);
        }

        return '';
    }

    prepareResult(rawResult: any) {
        let result = '';

        if (typeof rawResult === 'string' || Array.isArray(rawResult)) {
            result = JSON.stringify({result: rawResult});
        } else if (rawResult) {
            result = JSON.stringify(rawResult);
        }

        return result;
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const controllerName = context.getClass().name;
        const handlerName = context.getHandler().name;
        const request: ApplicationRequest = context.switchToHttp().getRequest();
        const logger = new Logger(`${controllerName}.${handlerName}`);

        const query = this.prepareQuery(request);
        const body = this.prepareBody(request);
        if (query) {
            logger.verbose(`Query: ${query}`);
        }
        if (body) {
            logger.verbose(`Body: ${body}`);
        }

        return next
            .handle()
            .pipe(
                tap((rawResult) => {
                    const result = this.prepareResult(rawResult);
                    if (result) {
                        logger.verbose(`Result: ${result}`);
                    }
                }),
            );
    }
}
