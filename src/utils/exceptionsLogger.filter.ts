import { ExceptionFilter } from './../../node_modules/@nestjs/common/interfaces/exceptions/exception-filter.interface.d';
import { ArgumentsHost, Catch, NotFoundException, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from "@nestjs/core";
import { Response, Request } from 'express';

// presently catching all exceptions, to catch custom, supply them in the parameter
// You will need use this as decorator in controllers or add it to the main.ts or app module
// This is not the best way to log things in nestjs, https://docs.nestjs.com/techniques/logger 
@Catch()
export class ExceptionsLoggerFilter extends BaseExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void {
        console.log('Exception thrown', exception)
        super.catch(exception, host)
    }
}

@Catch(NotFoundException)
export class CustomHttpExceptionFilter implements ExceptionFilter {
    catch(exception: NotFoundException, host: ArgumentsHost) {
        const context = host.switchToHttp()
        const response = context.getResponse<Response>()
        const request = context.getRequest<Request>()
        const status = exception.getStatus()
        const message = exception.message

        response.status(status).json({
            message, statusCode: status, time: new Date().toISOString()
        })

    }
}