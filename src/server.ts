import http from 'http';
import debug from 'debug';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { serverConfig } from './config';
import { App } from './app';
import { BrandController } from './controllers/v1/brand.controller';

const expressLog = debug('app');

const app = new App([new BrandController()]);

const swaggerSpec = swaggerJSDoc({
    definition: require('./swagger.json'),
    apis: ['./src/controllers/v1/*.controller.ts'],

});
const swaggerOptions = {
    explorer: true
};
app.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

http.createServer(app.app).listen(serverConfig.port, () => {
    expressLog(`server started port ${serverConfig.port}`);
});
