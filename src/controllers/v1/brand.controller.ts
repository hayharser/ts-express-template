import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import { BaseController } from '../controller.interface';

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

    /**
     * @openapi
     * /users:
     *   get:
     *     summary: fetch all
     *     responses:
     *       200:
     *         description: ok
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/user'
     */
    getAll: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({ a: 23 });
    };
}