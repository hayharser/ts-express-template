import { cleanEnv, str } from 'envalid';

const { REDIS_URL } = cleanEnv(process.env, {
    REDIS_URL: str()
});

export const redisConfigs = {
    url: REDIS_URL
};
