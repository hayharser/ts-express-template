import { HttpException } from './http.exception';
import { ZodIssue } from 'zod';

export class ValidationException extends HttpException {
    constructor(errors: ZodIssue[]) {
        super(400, 'validation error', errors);
    }
}
