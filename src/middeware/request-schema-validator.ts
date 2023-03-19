import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, z, ZodError } from 'zod';
import { ValidationException } from '../exceptions/validation.exception';

export const validateBody = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync(req.body);
        return next();
    } catch (error) {
        if (error instanceof ZodError) {
            return next(new ValidationException(error.errors));
        }
    }
};

export async function validateRequest<T extends AnyZodObject>(schema: T, req: Request): Promise<z.infer<T>> {
    return schema.parseAsync(req);
}
