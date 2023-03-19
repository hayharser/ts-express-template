import express from 'express';

export interface ControllerInterface {
    path: string;
    router: express.Router;
    initRouters: () => void;
}

export abstract class BaseController implements ControllerInterface {
    abstract path: string;
    router!: express.Router;

    constructor() {
        this.createRouter();
    }

    protected createRouter() {
        this.router = express.Router();
        this.initRouters();
    }

    abstract initRouters(): void;
}
