import { cleanEnv, port } from 'envalid';

const { PORT } = cleanEnv(process.env, {
    PORT: port({ devDefault: 3000 })
});

export const serverConfig = {
    port: PORT
};
