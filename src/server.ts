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
import './providers/mongo-db.provider';
import './providers/redis-connection';

import { AuthController, BrandController, UserController } from './controllers/v1';

import { serverConfig } from './config/server.configs';

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
