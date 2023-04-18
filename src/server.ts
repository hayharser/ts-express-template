import 'reflect-metadata';
import './config/dotenv';
import http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import Container from 'typedi';
import debug from 'debug';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { App } from './app';
import { MongoDbProvider } from './providers/mongo-db.provider';

import { AuthController, BrandController, UserController } from './controllers/v1';
import { mongoConfigs } from './config/mongo.configs';
import { redisConfigs } from './config/redis.configs';
import { serverConfig } from './config/server.configs';
import { RedisProvider } from './providers/redis.provider';

const appDebugger = debug('app:server');

const app = new App([
    Container.get(AuthController),
    Container.get(UserController),
    new BrandController()
]);

const swaggerSpec = swaggerJSDoc({
    definition: require('./swagger.json'),
    apis: ['./src/controllers/v1/*.controller.ts', './dist/controllers/v1/*.controller.js']
});
const swaggerOptions = {
    explorer: true
};
app.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

const mongoDbProvider = new MongoDbProvider(mongoConfigs);
const redisProvider = new RedisProvider(redisConfigs.url, 'cache');

Promise.all([redisProvider.connect(), mongoDbProvider.connect()])
    .then(() => {
        appDebugger('connected to mongodb');
    })
    .then(() => {
        // create http server
        http.createServer(app.app).listen(serverConfig.port, () => {
            appDebugger(`server started at port: ${serverConfig.port}`);
        });

        https
            .createServer(
                // Provide the private and public key to the server by reading each
                // file's content with the readFileSync() method.
                {
                    key: fs.readFileSync('./key.pem'),
                    cert: fs.readFileSync('./cert.pem')
                },
                app.app
            )
            .listen(443, () => {
                appDebugger('server started at port 443');
            });
    });
