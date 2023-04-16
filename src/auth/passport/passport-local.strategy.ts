import { Strategy as LocalStrategy } from 'passport-local';
import crypto from 'crypto';

// crypto.DEFAULT_ENCODING = 'hex';

export const PassportLocalStrategy = new LocalStrategy(
    { session: false, passReqToCallback: true },
    (req, username, password, done) => {
        // console.log('local passport', username, password);
        const user = {
            salt: 'efegwgfec',
            hashedPassword: '894bbbce5808dab3bbae74ec1957be1bc24a44ef90b53a9c6e7da96c9787c229'
        };
        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) {
                return done(err);
            }

            if (user.hashedPassword !== hashedPassword.toString('hex')) {
                return done(null, false, {
                    message: 'Incorrect username or password.'
                });
            }
            // if (!crypto.timingSafeEqual(Buffer.from(user.hashedPassword), hashedPassword)) {
            //     return done(null, false, {
            //         message: 'Incorrect username or password.'
            //     });
            // }
            return done(null, user);
        });
    }
);
