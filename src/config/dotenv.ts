import dotenv from 'dotenv';
import { cleanEnv, str } from 'envalid';

// do not run on production
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const env = cleanEnv(process.env, {
    NODE_ENV: str({
        default: 'development',
        choices: ['development', 'test', 'production', 'staging']
    })
});

Object.assign(process.env, env);
