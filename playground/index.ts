import '../src/config/dotenv';
import { RedisClientName, RedisConnection } from '../src/providers/redis-connection';
import { redisConfigs } from '../src/config/redis.configs';

const redisProvider = new RedisConnection(redisConfigs.url, RedisClientName.CACHE, 1);
redisProvider.connect();

const redisClient = redisProvider.client;

async function run() {
    redisClient.set('wasd', 'erfd');
}

run();
