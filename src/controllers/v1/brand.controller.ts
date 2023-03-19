import { NextFunction, Request, RequestHandler, Response } from 'express';
import { BaseController } from '../controller.interface';
import { logger } from '../../providers/logger';

export class BrandController extends BaseController {
    path = '/brands';

    constructor(path?: string) {
        super();
        path && (this.path = path);
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
    getAll(req: Request, res: Response, next: NextFunction) {
        res.status(200).json({ a: 23 });
    }

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
