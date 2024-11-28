import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger} from '@nestjs/common';
import {MESSAGES} from '@nestjs/core/constants';

import {ApplicationResponse} from '@root/types';

@Catch()
export class ErrorFilter implements ExceptionFilter {
    logger = new Logger(ErrorFilter.name);

    catch(err: HttpException | Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<ApplicationResponse>();

        if (err instanceof HttpException) {
            response.status(err.getStatus()).json(err.getResponse());
        } else {
            this.logger.error(err);
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({statusCode: HttpStatus.INTERNAL_SERVER_ERROR, name: MESSAGES.UNKNOWN_EXCEPTION_MESSAGE});
        }
    }
}
