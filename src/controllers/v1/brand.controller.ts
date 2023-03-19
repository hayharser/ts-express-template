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
     *     tags: [Users]
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

    /**
     * @openapi
     * /users/{id}:
     *   get:
     *     summary: get by is
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: get user by id
     *     responses:
     *       200:
     *         description: ok
     *         content:
     *           application/json:
     *             schema:
     *                 $ref: '#/components/schemas/user'
     *
     */
    getbyId: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({ a: 23 });
    };
}