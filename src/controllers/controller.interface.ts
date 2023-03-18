import express from 'express';

export interface ControllerInterface {
    path: string;
    router: express.Router;
    initRouters: () => void;
}

export abstract class BaseController implements ControllerInterface {
    abstract path: string;
    abstract router: express.Router;

    constructor() {

    }

    abstract initRouters(): void;
}
