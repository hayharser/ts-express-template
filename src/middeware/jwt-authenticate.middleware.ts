import passport from 'passport';

export const jwtAuthenticate = () => {
    return passport.authenticate('jwt', { session: false });
};
