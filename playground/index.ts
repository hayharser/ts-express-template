import '../src/config/dotenv';
import { RedisProvider } from '../src/providers/redis.provider';
import { redisConfigs } from '../src/config/redis.configs';

const redisProvider = new RedisProvider(redisConfigs.url, 'cache');

async function run() {
    await redisProvider.connect();
}

run();
