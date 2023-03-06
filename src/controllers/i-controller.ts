import express from 'express';

export interface IController {
    path: string;
    router: express.Router;
    initRouters: () => void;
}

export abstract class BaseController implements IController {
    abstract path: string;
    abstract router: express.Router;

    constructor() {

    }

    abstract initRouters(): void;
}
