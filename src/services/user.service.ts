import { Inject, Service } from 'typedi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import debug from 'debug';
import { RedisClientType } from 'redis';
import { Logger } from 'winston';

import { UserRepository } from '../repos/user.repository';
import { UserServiceModel } from './models/user.service.model';
import { AppException } from '../exceptions/app.exception';
import { jwtConfigs } from '../config/jwt.configs';
import { User } from '../models/user.model';
import { CACHE_REDIS_TOKEN } from '../providers/redis-connection';
import { InjectLogger } from '../providers/logger';

const appDebugger = debug('app:service');

@Service()
export class UserService {
    @Inject() private readonly userRepo: UserRepository;
    @InjectLogger() private readonly logger: Logger;
    @Inject(CACHE_REDIS_TOKEN) private readonly redisCacheClient: RedisClientType;

    constructor() {
        appDebugger('UserService->constructor');
    }

    async getUserById(id: string) {
        return (await this.userRepo.findById(id))?.toApiModel();
    }

    async getUserByEmail(email: string) {
        return (await this.userRepo.findByEmail(email))?.toApiModel();
    }

    async getUserByUsername(username: string) {
        return (await this.userRepo.findUserByUsername(username))?.toApiModel();
    }

    async getUserByEmailAndPassword(email: string, password: string) {
        const userDoc = await this.userRepo.findByEmail(email);
        if (!userDoc || !userDoc.password) {
            return null;
        }

        const match = await bcrypt.compare(password, userDoc.password);
        if (!match) {
            this.logger.debug('passwords do not match');
            return null;
        }
        return userDoc?.toApiModel();
    }

    async getUserByUsernameAndPassword(username: string, password: string) {
        const userDoc = await this.userRepo.findUserByUsername(username);
        if (!userDoc || !userDoc.password) {
            return null;
        }

        const match = await bcrypt.compare(password, userDoc.password);
        if (!match) {
            return null;
        }
        return userDoc?.toApiModel();
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

        userDoc = await this.userRepo.createUser(user);

        this.redisCacheClient.set(`user:${userDoc._id.toString()}`, user.email);
        return userDoc.toApiModel();
    }

    async generateJwtToken(user: UserServiceModel) {
        if (!user.id) {
            throw new AppException('user does not have id');
        }
        return jwt.sign({ id: user.id }, jwtConfigs.jwtSecret, jwtConfigs.options);
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
            return userDoc.toApiModel();
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
            return (await userDoc.save()).toApiModel();
        }
        userDoc = await this.userRepo.createUser({
            firstName: fbUserData.firstName,
            lastName: fbUserData.lastName,
            email: fbUserData.email,
            phoneNumber: '-',
            federatedAccounts: [facebookProvider]
        });
        return userDoc.toApiModel();
    }

    generateSalt(): Promise<string> {
        return bcrypt.genSalt(10);
    }

    hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}
