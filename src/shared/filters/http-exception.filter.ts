import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AppError } from '../models/app-error';

@Catch(AppError)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: AppError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const statusCode = HttpStatus.BAD_REQUEST;
        const message = exception.message;

        response.status(statusCode).json({
            statusCode,
            message,
        });
    }
}
