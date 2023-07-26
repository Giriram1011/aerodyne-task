import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { MongoServerError } from 'mongodb';

@Catch(MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = HttpStatus.CONFLICT; 

    if (exception.code === 11000) {
      const keyField = Object.keys(exception.keyValue)[0];
      const keyValue = exception.keyValue[keyField];
      const message = `Duplicate ${keyField} found with value: ${keyValue}`;
      response.status(status).json({
        statusCode: status,
        message: message,
      });
    } else {
      response.status(status).json({
        statusCode: status,
        message: 'Generic MongoDB error.',
      });
    }
  }
}
