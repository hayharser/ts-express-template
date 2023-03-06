import dotenv from 'dotenv';

import { corsOptions } from './cors.config';

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT ?? process.env.PORT;

const serverConfig = {
    port: SERVER_PORT
};

const morganFormat = 'tiny';

export { corsOptions, morganFormat, serverConfig };
