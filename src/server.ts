import { serverConfig } from './config'; // this should be first
import http from 'http';
import debug from 'debug';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { App } from './app';

import { BrandController } from './controllers/v1/brand.controller';
import { AuthController } from './controllers/v1/auth.controller';
import { logger } from './providers/logger';

const expressLog = debug('app:server');

const app = new App([new BrandController(), new AuthController()]);

const swaggerSpec = swaggerJSDoc({
    definition: require('./swagger.json'),
    apis: ['./src/controllers/v1/*.controller.ts', './dist/controllers/v1/*.controller.js']
});
const swaggerOptions = {
    explorer: true
};
app.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

http.createServer(app.app).listen(serverConfig.port, () => {
    expressLog(`server started at port: ${serverConfig.port}`);
    logger.info('hello', { message: 'world' });
});
