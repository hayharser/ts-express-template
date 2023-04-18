import { Strategy as LocalStrategy } from 'passport-local';
import Container from 'typedi';

import { UserService } from '../../services/user.service';

const userService = Container.get<UserService>(UserService);

export const PassportLocalStrategy = new LocalStrategy(
    { session: false, passReqToCallback: true },
    async (req, username, password, done) => {
        try {
            let userDoc = await userService.getUserByEmailAndPassword(username, password);
            if (!userDoc) {
                userDoc = await userService.getUserByUsernameAndPassword(username, password);
            }
            return done(null, userDoc ?? false);
        } catch (error) {
            done(error);
        }
    }
);
