import { Inject, Service } from 'typedi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { UserRepository } from '../repos/user.repository';
import { UserServiceModel } from './models/user.service.model';
import { ILogger, Logger } from '../providers/logger';
import { AppException } from '../exceptions/app.exception';
import { jwtConfigs } from '../config/jwt.configs';
import { User } from '../models/user.model';

@Service()
export class UserService {
    constructor(
        @Inject() private readonly userRepo: UserRepository,
        @Logger() private readonly logger: ILogger
    ) {
        this.logger.info('user service constructor');
    }

    async getUserById(id: string) {
        return await this.userRepo.findById(id);
    }

    async getUserByEmail(email: string) {
        return await this.userRepo.findByEmail(email);
    }

    async getUserByUsername(username: string) {
        return await this.userRepo.findUserByUsername(username);
    }

    /**
     * register user by email and password
     * @param userModel
     */
    async registerUser(userModel: UserServiceModel) {
        let userDoc = await this.userRepo.findByEmail(userModel.email);
        if (userDoc) {
            throw new AppException('User with email already exists');
        }

        const user: User = {
            firstName: userModel.firstName,
            lastName: userModel.lastName,
            email: userModel.email,
            username: userModel.username,
            phoneNumber: userModel.phoneNumber,
            federatedAccounts: []
        };

        if (!userModel.password) {
            throw new AppException('Wrong Password');
        }

        const salt = await this.generateSalt();
        user.password = await this.hashPassword(userModel.password, salt);
        user.salt = salt;

        userDoc = await this.userRepo.createUser(user);
        return userDoc.toJSON();
    }

    async generateJwtToken(user: UserServiceModel) {
        return jwt.sign({ id: user._id }, jwtConfigs.jwtSecret, jwtConfigs.options);
    }

    /**
     * login FB user
     * @param fbUserData
     */
    async loginFbUser(fbUserData: UserServiceModel) {
        this.logger.info('fbUserData').info(fbUserData);

        // fetch user by fb-id
        const { provider } = fbUserData;
        if (!provider) {
            throw new AppException('facebook data does not exist');
        }
        let userDoc = await this.userRepo.findByFacebookId(provider.id);
        if (userDoc) {
            return userDoc.toJSON();
        }
        // find user by email and attach new provider
        userDoc = await this.userRepo.findByEmail(fbUserData.email);

        const facebookProvider = {
            id: provider.id,
            provider: 'facebook',
            accessToken: provider.accessToken,
            refreshToken: provider.refreshToken
        };
        if (userDoc) {
            userDoc.federatedAccounts.push(facebookProvider);
            return (await userDoc.save()).toJSON();
        }
        userDoc = await this.userRepo.createUser({
            firstName: fbUserData.firstName,
            lastName: fbUserData.lastName,
            email: fbUserData.email,
            phoneNumber: '-',
            federatedAccounts: [facebookProvider]
        });
        return userDoc.toJSON();
    }

    generateSalt(): Promise<string> {
        return bcrypt.genSalt(10);
    }

    hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}
