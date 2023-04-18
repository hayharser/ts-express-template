import { Service } from 'typedi';
import { FederatedAccountProviders, User, UserModel } from '../models/user.model';
import { logger } from '../providers/logger';
import { Types } from 'mongoose';

@Service()
export class UserRepository {
    constructor() {
        logger.info('UserRepository->constructor');
    }

    async findById(id: string) {
        return await UserModel.findOne({ _id: id }).exec();
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
