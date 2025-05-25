/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import { Error } from 'mongoose';
import { ErrorApiResponse } from '../dto/api-response/Error-api-response.dto';
import { ConfigService } from '@nestjs/config';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message, errors } = this.handleException(exception);

    // Log the error
    this.logError(request, status, message, exception);

    // Send the error response
    this.sendErrorResponse(response, status, message, errors, exception);
  }

  private handleException(exception: unknown): {
    status: number;
    message: string;
    errors: Record<string, string[]> | null;
  } {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = 'Internal server error';
    const errors: Record<string, string[]> | null = null;

    if (exception instanceof HttpException) {
      return this.handleHttpException(exception);
    } else if (exception instanceof MongoError) {
      return this.handleMongoError(exception);
    } else if (exception instanceof Error.ValidationError) {
      return this.handleValidationError(exception);
    }

    return { status, message, errors };
  }

  private handleHttpException(exception: HttpException): {
    status: number;
    message: string;
    errors: Record<string, string[]> | null;
  } {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    let message = 'Internal server error';
    let errors: Record<string, string[]> | null = null;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const exceptionObj = exceptionResponse as any;
      message = exceptionObj.message ?? message;

      if (Array.isArray(exceptionObj.message)) {
        message = 'Validation failed';
        errors = this.formatValidationErrors(exceptionObj.message);
      }
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    return { status, message, errors };
  }

  private handleMongoError(exception: MongoError): {
    status: number;
    message: string;
    errors: Record<string, string[]> | null;
  } {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: Record<string, string[]> | null = null;

    if (exception.code === 11000) {
      status = HttpStatus.CONFLICT;
      message = 'Duplicate key error';
      const keyPattern = (exception as any).keyPattern;
      if (keyPattern) {
        const field = Object.keys(keyPattern)[0];
        errors = { [field]: ['This value already exists'] };
      }
    }

    return { status, message, errors };
  }

  private handleValidationError(exception: Error.ValidationError): {
    status: number;
    message: string;
    errors: Record<string, string[]> | null;
  } {
    const status = HttpStatus.BAD_REQUEST;
    const message = 'Validation error';
    const errors: Record<string, string[]> = {};

    for (const field in exception.errors) {
      errors[field] = [exception.errors[field].message];
    }

    return { status, message, errors };
  }

  private logError(request: Request, status: number, message: string, exception: unknown): void {
    const stackTrace = exception instanceof Error ? exception.stack : 'No stack trace available';
    this.logger.error(
      `${request.method} ${request.url} ${status} - ${message}\nStack Trace: ${stackTrace}`,
    );
    this.logger.error(
      `${request.method} ${request.url} ${status} - ${message}\nStack Trace: ${exception}`,
    );
  }

  private sendErrorResponse(
    response: Response,
    status: number,
    message: string,
    errors: Record<string, string[]> | null,
    exception: unknown,
  ): void {
    const responseBody: ErrorApiResponse = {
      isSuccess: false,
      message,
    };

    if (errors) {
      responseBody.errors = errors;
    }

    // Include stack trace in development environment
    if (this.configService.get<string>('NODE_ENV') === 'development') {
      responseBody.stack = exception instanceof Error ? exception.stack : undefined;
    }

    response.status(status).json(responseBody);
  }

  private formatValidationErrors(messages: string[]): Record<string, string[]> {
    // Implement your formatting logic here
    return { validationErrors: messages }; // Example implementation
  }
}
