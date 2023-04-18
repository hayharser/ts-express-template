import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import Container from 'typedi';

import { UserService } from '../../services/user.service';

const userService = Container.get<UserService>(UserService);

export const PassportLocalStrategy = new LocalStrategy(
    { session: false, passReqToCallback: true },
    async (req, username, password, done) => {
        let userDoc = await userService.getUserByEmail(username);
        if (!userDoc) {
            userDoc = await userService.getUserByUsername(username);
        }
        if (!userDoc || !userDoc.salt || !userDoc.password) {
            return done(null, false);
        }
        const match = await bcrypt.compare(password, userDoc.password);
        if (match) {
            return done(null, userDoc);
        } else {
            return done(null, false, {
                message: 'Incorrect username or password.'
            });
        }
    }
);
