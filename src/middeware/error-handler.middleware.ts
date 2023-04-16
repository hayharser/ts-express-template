import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/http.exception';

export const errorHandlerMiddleware: ErrorRequestHandler = (
    error: HttpException,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    const errors = error.errors;
    response.status(status).send({
        status,
        message,
        errors
    });
};
