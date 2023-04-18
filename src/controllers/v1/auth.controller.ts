import { Inject, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import passport from 'passport';

import { BaseController } from '../controller.interface';
import { validateBody } from '../../middeware/request-schema-validator.middleware';
import { UserService } from '../../services/user.service';
import { UserApiModel } from '../../models/api/user.api.model';

const SignUpBodySchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string(),
    username: z.string(),
    email: z.string().email('wrong email provided'),
    password: z.string().min(8, 'password min length is 8')
});

const SignInBodySchema = z.object({
    username: z.string(),
    password: z.string().min(8, 'password min length is 8')
});

@Service()
export class AuthController extends BaseController {
    constructor(@Inject() private readonly userService: UserService) {
        super('/');
    }

    initRouters(): void {
        // register
        this.router.post('/auth/signup', validateBody(SignUpBodySchema), this.signup.bind(this));
        // log in
        this.router.post(
            '/auth/signin',
            validateBody(SignInBodySchema),
            passport.authenticate('local', { session: false }),
            this.signin.bind(this)
        );
        // register
        this.router.post('/auth/signun', validateBody(SignUpBodySchema), this.signup.bind(this));

        // FB sign in
        this.router.post(
            '/auth/facebook/by-token',
            passport.authenticate('facebook-by-token', {
                session: false
            }),
            this.fbSignIn.bind(this)
        );
        // FB sign in
        this.router.get(
            '/auth/facebook',
            passport.authenticate('facebook', {
                session: false,
                scope: [
                    'email',
                    'public_profile',
                    'public_profile',
                    'user_birthday',
                    'user_location',
                    'user_age_range'
                ]
            })
        );

        // FB sign in
        this.router.get(
            '/auth/redirect/facebook',
            passport.authenticate('facebook', {
                session: false,
                // failureMessage: false,
                scope: ['public_profile', 'email']
            }),
            this.fbSignIn.bind(this)
        );

        // log out
        this.router.get('/logout', this.logout.bind(this));
    }

    //----------------- ACTIONS

    async signup(req: Request, res: Response, next: NextFunction) {
        const userRequestData = req.body as z.infer<typeof SignUpBodySchema>;
        try {
            const userData = await this.userService.registerUser({
                ...userRequestData
            });
            // generate JWT access token
            const jwtToken = await this.userService.generateJwtToken(userData);

            res.status(201)
                .setHeader('Token', jwtToken)
                .json({ status: 'ok', data: { ...userData } });
        } catch (error) {
            next(error);
        }
    }

    async signin(req: Request, res: Response) {
        const user = req.user as UserApiModel;
        const jwtToken = await this.userService.generateJwtToken(user);

        res.status(201)
            .setHeader('Token', jwtToken)
            .json({ ...req.user });
    }

    fbSignIn(req: Request, res: Response) {
        const user = req.user;
        // this.userService.loginFbUser(),
        res.status(201).json({ ...req.user });
    }

    logout(req: Request, res: Response) {
        res.status(200).json({});
    }
}
