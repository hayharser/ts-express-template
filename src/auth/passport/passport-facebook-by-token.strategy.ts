import Container from 'typedi';
import got from 'got';
import { Strategy as CustomStrategy } from 'passport-custom';

import { UserService } from '../../services/user.service';
import { FbUser } from './models';

const userService = Container.get<UserService>(UserService);

export const PassportFacebookByTokenStrategy = new CustomStrategy(async (req, done) => {
    const { accessToken } = req.body;

    try {
        const data = await got
            .get('https://graph.facebook.com/v16.0/me', {
                searchParams: {
                    access_token: accessToken,
                    fields: 'id,name,email,birthday,first_name,last_name,gender'
                }
            })
            .json<FbUser>();
        const user = await userService.loginFbUser({
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            provider: {
                id: data.id,
                accessToken: accessToken
            }
        });

        done(null, user);
    } catch (error) {
        return done(error);
    }
});
