import { ExtractJwt, Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';

import { jwtConfigs } from '../../config/jwt.configs';
import Container from 'typedi';
import { UserService } from '../../services/user.service';

interface JwtPayload {
    id: string;
}

const userService = Container.get<UserService>(UserService);
export const PassportJwtStrategy = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtConfigs.jwtSecret
    },
    async (jwtPayload: JwtPayload, done: VerifiedCallback) => {
        const id = jwtPayload.id;

        try {
            const userApiModel = await userService.getUserById(id);
            if (userApiModel) {
                done(null, userApiModel);
            } else {
                done(null, false);
            }
        } catch (error) {
            done(error);
        }
    }
);
