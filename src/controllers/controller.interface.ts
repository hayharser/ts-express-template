import express from 'express';
import { Service } from 'typedi';

export interface ControllerInterface {
    path: string;
    router: express.Router;
    initRouters: () => void;
}

@Service()
export abstract class BaseController implements ControllerInterface {
    path: string;
    router!: express.Router;

    constructor(path: string) {
        this.path = path;
        this.createRouter();
    }

    protected createRouter() {
        this.router = express.Router();
        this.initRouters();
    }

    abstract initRouters(): void;
}
