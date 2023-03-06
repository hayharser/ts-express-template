import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import { BaseController } from '../i-controller';

export class BrandController extends BaseController {
    path: string = '/brands';
    router: express.Router;

    constructor(path?: string) {
        super();
        path && (this.path = path);
        this.router = express.Router();
        this.initRouters();
    }

    initRouters(): void {
        this.router.get('/', this.getAll);
    }

    getAll: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({ a: 23 });
    };
}