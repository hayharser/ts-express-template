import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { corsOptions, morganFormat } from './config';

import { IController } from './controllers/i-controller';
import { errorHandlerMiddleware } from './middeware/error-handler.middleware';

const swaggerDocument = require('../swagger.json');

export class App {
    public app: express.Application;

    constructor(controllers: IController[]) {
        this.app = express();
        this.initializeGlobalMiddlewares();
        this.initializeControllers(controllers);

        this.app.get('/', (req: Request, res: Response) => {
            return res.status(200).json({ message: 'Welcome to the API' });
        });

        this.app.use(errorHandlerMiddleware);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    private initializeGlobalMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(helmet());
        this.app.use(cors(corsOptions));
        this.app.use(morgan(morganFormat));
    }

    private initializeControllers(controllers: IController[]) {
        const v1Router = express.Router();
        controllers.forEach((controller) => {
            v1Router.use(controller.path, controller.router);
        });
        this.app.use('/api/v1', v1Router);
    }
}
