import { Inject, Service } from 'typedi';
import { Types } from 'mongoose';
import debug from 'debug';
import { RedisClientType } from 'redis';

import { FederatedAccountProviders, User, UserModel } from '../models/user.model';
import { CACHE_REDIS_TOKEN } from '../providers/redis-connection';

const appDebugger = debug('app:repository');

@Service()
export class UserRepository {
    @Inject(CACHE_REDIS_TOKEN) private readonly redisCacheClient: RedisClientType;

    constructor() {
        appDebugger('UserRepository->constructor');
    }

    findById(id: string) {
        return UserModel.findOne({ _id: id }).exec();
    }

    async findByEmail(email: string) {
        return await UserModel.findOne({ email: email }).exec();
    }

    async findUserByUsername(username: string) {
        return await UserModel.findOne({ username: username }).exec();
    }

    async findByFacebookId(facebookId: string) {
        return await UserModel.findOne({
            'federatedAccounts.id': facebookId,
            'federatedAccounts.provider': FederatedAccountProviders.FACEBOOK
        }).exec();
    }

    createUser(user: User) {
        return UserModel.create(user);
    }

    async updateUser(_id: Types.ObjectId, user: User) {
        const res = await UserModel.updateOne({ _id: _id }, user);
    }
}
