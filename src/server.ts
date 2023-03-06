import http from 'http';
import { serverConfig } from './config';
import debug from 'debug';
import { App } from './app';
import { BrandController } from './controllers/v1/brand.controller';

const expressLog = debug('app');

const app = new App([new BrandController()]);

http.createServer(app.app).listen(serverConfig.port, () => {
    expressLog(`server started port ${serverConfig.port}`);
});
