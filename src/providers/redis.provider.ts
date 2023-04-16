import { createClient, RedisClientType } from 'redis';
import { logger } from './logger';

export class RedisProvider {
    static Clients = new Map<string, RedisClientType>();
    client: RedisClientType;

    constructor(url: string, name: string) {
        this.client = createClient({
            url
        });
        this.client.on('error', (err) => logger.error(err));
        RedisProvider.Clients.set(name, this.client);
    }

    async connect() {
        await this.client.connect();
    }
}
