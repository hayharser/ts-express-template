import { ExtractJwt, Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';

interface JwtPayload {
    id: string;
}

export const PassportJwtStrategy = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    },
    (jwtPayload: JwtPayload, done: VerifiedCallback) => {
        const id = jwtPayload.id;
        // db.get('SELECT * FROM users WHERE username = ?', [username], function(err, row) {
        //     if (err) {
        //         return cb(err);
        //     }
        //     if (!row) {
        //         return cb(null, false, { message: 'Incorrect username or password.' });
        //     }
        // });
        done(null, { id }, { name: 'harut' });
    }
);
