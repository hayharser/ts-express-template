import Container from 'typedi';
import { Strategy as FacebookStrategy } from 'passport-facebook';

import { UserService } from '../../services/user.service';
import { FbUser } from './models';

const userService = Container.get<UserService>(UserService);

export const PassportFacebookStrategy = new FacebookStrategy(
    {
        clientID: process.env.FACEBOOK_APP_ID!,
        clientSecret: process.env.FACEBOOK_APP_SECRET!,
        callbackURL: `${process.env.FACEBOOK_CALLBACK_URL}/auth/redirect/facebook`,
        profileFields: [
            'id',
            'photos',
            'emails',
            'displayName',
            'gender',
            'name',
            'profileUrl',
            'birthday'
        ]
    },
    async (accessToken, refreshToken, profile, done) => {
        const { id, first_name, last_name, email } = profile._json as FbUser;
        try {
            const user = await userService.loginFbUser({
                email,
                firstName: first_name,
                lastName: last_name,
                provider: {
                    id,
                    accessToken,
                    refreshToken
                }
            });
            done(null, user);
        } catch (error) {
            done(error);
        }
    }
);
