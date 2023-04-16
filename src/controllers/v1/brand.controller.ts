import { NextFunction, Request, RequestHandler, Response } from 'express';
import passport from 'passport';

import { BaseController } from '../controller.interface';

export class BrandController extends BaseController {
    constructor() {
        super('/brands');
    }

    initRouters(): void {
        this.router.get('/', passport.authenticate('JWT'), this.getAll);
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
    getbyId: RequestHandler = (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        res.status(200).json({ a: 23 });
    };
}
