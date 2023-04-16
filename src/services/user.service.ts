import { Inject, Service } from 'typedi';
import { logger } from '../providers/logger';
import { UserRepository } from '../repos/user.repository';
import { UserServiceModel } from './models/user.service.model';
import { User } from '../models/user.model';

@Service()
export class UserService {
    constructor(@Inject() private readonly userRepo: UserRepository) {
        logger.info('user service constructor');
    }

    async loginFbUser(fbUserData: UserServiceModel) {
        const userDoc = await this._loginFbUser(fbUserData);
    }

    private async _loginFbUser(fbUserData: UserServiceModel) {
        // fetch user by fb-id
        const { provider } = fbUserData;
        let user = await this.userRepo.findByFacebookId(provider.id);
        if (user) {
            return user;
        }
        // find user by email and attach new provider
        user = await this.userRepo.findByEmail(fbUserData.email);

        const facebookProvider = {
            id: provider.id,
            provider: 'facebook',
            accessToken: provider.accessToken,
            refreshToken: provider.refreshToken
        };
        if (user) {
            user.federatedAccounts.push(facebookProvider);
            return await this.userRepo.updateUser(user._id, user as User);
        }
        return await this.userRepo.createUser({
            firstName: fbUserData.firstName,
            lastName: fbUserData.lastName,
            email: fbUserData.email,
            phoneNumber: '-',
            federatedAccounts: [facebookProvider]
        });
    }
}
