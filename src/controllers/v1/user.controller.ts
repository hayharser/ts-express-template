import { Inject, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

import { UserService } from '../../services/user.service';
import { BaseController } from '../controller.interface';
import { logger } from '../../providers/logger';
import { jwtAuthenticate } from '../../middeware/jwt-authenticate.middleware';

@Service()
export class UserController extends BaseController {
    constructor(@Inject() private readonly userService: UserService) {
        super('/user');
    }

    initRouters(): void {
        this.router.get('/', jwtAuthenticate(), this.getAll.bind(this));
    }

    getAll(req: Request, res: Response, next: NextFunction) {
        logger.info(req.user);
        res.status(200).json(req.user);
    }
}
