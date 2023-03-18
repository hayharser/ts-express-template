import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { corsOptions, morganFormat } from './config';

import { ControllerInterface } from './controllers/controller.interface';
import { errorHandlerMiddleware } from './middeware/error-handler.middleware';

export class App {
    public app: express.Application;

    constructor(controllers: ControllerInterface[]) {
        this.app = express();
        this.initializeGlobalMiddlewares();
        this.initializeControllers(controllers);

        this.app.get('/', (req: Request, res: Response) => {
            return res.status(200).json({ message: 'Welcome to the API' });
        });

        this.app.use(errorHandlerMiddleware);
    }

    private initializeGlobalMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use('/api/v1', helmet());
        this.app.use(cors(corsOptions));
        this.app.use(morgan(morganFormat));
    }

    private initializeControllers(controllers: ControllerInterface[]) {
        const v1Router = express.Router();
        controllers.forEach((controller) => {
            v1Router.use(controller.path, controller.router);
        });
        this.app.use('/api/v1', v1Router);
    }
}
