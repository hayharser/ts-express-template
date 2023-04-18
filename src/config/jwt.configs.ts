import { cleanEnv, str } from 'envalid';

const { JWT_SECRET } = cleanEnv(process.env, {
    JWT_SECRET: str()
});
export const jwtConfigs = {
    jwtSecret: JWT_SECRET,
    options: {}
};
