import * as mongoose from 'mongoose';
import { logger } from './logger';

interface MongoOptions {
    host: string;
    user: string;
    password: string;
    db: string;
}

export class MongoDbProvider {
    url: string;

    constructor({ password, user, host, db }: MongoOptions) {
        this.url = `mongodb://${user}:${password}@${host}/${db}?authSource=admin`;
        logger.info(this.url);
    }

    connect() {
        return mongoose.connect(this.url);
    }
}
