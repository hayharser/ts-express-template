import { ZodIssue } from 'zod';

export class HttpException extends Error {
    status: number;
    message: string;
    errors?: ZodIssue[];

    constructor(status: number, message: string, errors?: ZodIssue[]) {
        super(message);
        this.status = status;
        this.message = message;
        this.errors = errors;
    }
}
