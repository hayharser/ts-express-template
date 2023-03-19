import { BaseController } from '../controller.interface';
import { Request, Response } from 'express';
import { validateBody } from '../../middeware/request-schema-validator';
import { z } from 'zod';
import { logger } from '../../providers/logger';

const SignUpBodySchema = z.object({
    email: z.string().email('wrong email provided')
});

export class AuthController extends BaseController {
    path = '/';

    constructor(path?: string) {
        super();
        path && (this.path = path);
    }

    initRouters(): void {
        this.router.post('/signup', validateBody(SignUpBodySchema), this.signup);
        this.router.get('/logout', this.logout);
    }

    signup(req: Request, res: Response) {
        logger.info('some message');
        res.status(201).json({ ...req.body });
    }

    logout(req: Request, res: Response) {
        res.status(200).json({});
    }
}
