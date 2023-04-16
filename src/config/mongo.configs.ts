import { cleanEnv, host, str } from 'envalid';

const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_DB } = cleanEnv(
    process.env,
    {
        MONGO_USER: str(),
        MONGO_PASSWORD: str(),
        MONGO_HOST: host(),
        MONGO_DB: str()
    }
);

export const mongoConfigs = {
    user: MONGO_USER,
    password: MONGO_PASSWORD,
    host: MONGO_HOST,
    db: MONGO_DB
};
