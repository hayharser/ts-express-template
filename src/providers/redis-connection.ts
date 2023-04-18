import Container, { Token } from 'typedi';
import { createClient, RedisClientType } from 'redis';

import { logger } from './logger';
import { redisConfigs } from '../config/redis.configs';

export enum RedisClientName {
    CACHE = 'cache',
    SESSION = 'session',
    MAIN = 'main'
}

export class RedisConnection {
    client: RedisClientType;
    name: RedisClientName;
    dbNumber: number;

    constructor(url: string, name: RedisClientName, dbNumber = 0) {
        this.dbNumber = dbNumber;
        this.name = name;
        this.client = createClient({
            url
        });
        this.client.on('error', (err) => logger.error(err));
    }

    async connect() {
        await this.client.connect();
        this.client.select(this.dbNumber);
    }
}

const Clients = new Map<RedisClientName, RedisClientType>();

const connection = new RedisConnection(redisConfigs.url, RedisClientName.CACHE, 0);
connection.connect();
Clients.set(connection.name, connection.client);

export const CACHE_REDIS_TOKEN = new Token<string>(connection.name);

Container.set(CACHE_REDIS_TOKEN, connection.client);
