import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { ControllerInterface } from './controllers/controller.interface';
import { errorHandlerMiddleware } from './middeware/error-handler.middleware';

import { logger } from './providers/logger';
import { corsOptions } from './config/cors.config';
import { morganFormat } from './config/morgan.configs';

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

        morgan.token('body', (req: Request) => {
            if (['post', 'put', 'patch'].includes(req.method.toLowerCase())) {
                return JSON.stringify(req.body);
            }
            return undefined;
        });

        this.app.use(
            morgan(morganFormat, {
                stream: {
                    write(str: string) {
                        logger.http(str, { label: 'http' });
                    }
                }
            })
        );
    }

    private initializeControllers(controllers: ControllerInterface[]) {
        const v1Router = express.Router();
        controllers.forEach((controller) => {
            v1Router.use(controller.path, controller.router);
        });
        this.app.use('/api/v1', v1Router);
    }
}
