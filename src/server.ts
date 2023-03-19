import './config/dotenv'; // this should be first
import http from 'http';
import debug from 'debug';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { App } from './app';
import { MongoDbProvider } from './providers/mongo-db.provider';

import { BrandController } from './controllers/v1/brand.controller';
import { AuthController } from './controllers/v1/auth.controller';
import { mongoConfigs } from './config/mongo.configs';
import { serverConfig } from './config/server.configs';

const appDebugger = debug('app:server');

const app = new App([new BrandController(), new AuthController()]);

const swaggerSpec = swaggerJSDoc({
    definition: require('./swagger.json'),
    apis: ['./src/controllers/v1/*.controller.ts', './dist/controllers/v1/*.controller.js']
});
const swaggerOptions = {
    explorer: true
};
app.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

const mongoDb = new MongoDbProvider(mongoConfigs);

// connect to mongo
mongoDb
    .connect()
    .then(() => {
        appDebugger('connected to mongodb');
    })
    .then(() => {
        // create http server
        http.createServer(app.app).listen(serverConfig.port, () => {
            appDebugger(`server started at port: ${serverConfig.port}`);
        });
    });
