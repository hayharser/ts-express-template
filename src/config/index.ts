import dotenv from 'dotenv';

import { corsOptions } from './cors.config';

// do not run on production
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const SERVER_PORT = process.env.SERVER_PORT ?? process.env.PORT;
const NODE_ENV = process.env.NODE_ENV ?? 'dev';
const serverConfig = {
    port: SERVER_PORT
};
let morganFormat = ':method :url :status :response-time ms - :res[content-length] \n :body';
if (NODE_ENV === 'production') {
    morganFormat = 'tiny';
}

export { corsOptions, morganFormat, serverConfig };
