import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AppError } from '../models/app-error';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let statusCode: number;
        let message: string;

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            message = exception.message;
        }

        if (exception instanceof AppError) {
            statusCode = HttpStatus.BAD_REQUEST;
            message = exception.message;
        }

        response.status(statusCode).json({
            statusCode,
            message,
        });
    }
}
