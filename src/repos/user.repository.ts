import { Service } from 'typedi';
import { FederatedAccountProviders, User, UserModel } from '../models/user.model';
import { logger } from '../providers/logger';
import { Types } from 'mongoose';

@Service()
export class UserRepository {
    constructor() {
        logger.info('UserRepository->constructor');
    }

    async findByFacebookId(facebookId: string) {
        return (
            await UserModel.findOne({
                'federatedAccounts.id': facebookId,
                'federatedAccounts.provider': FederatedAccountProviders.FACEBOOK
            })
        )?.toJSON();
    }

    async findByEmail(email: string) {
        return (await UserModel.findOne({ email: email }).exec())?.toJSON();
    }

    async createUser(user: User) {
        const userDoc = await UserModel.create(user);
        await userDoc.save();
        return userDoc;
    }

    async updateUser(_id: Types.ObjectId, user: User) {
        const res = await UserModel.updateOne({ _id: _id }, user);
    }
}
