import dotenv from 'dotenv';
import { cleanEnv, str } from 'envalid';

// do not run on production
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

cleanEnv(process.env, {
    NODE_ENV: str({ devDefault: 'dev' })
});
