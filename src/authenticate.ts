import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';

import { Application, Request } from 'express';
import { Strategy, VerifiedCallback, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { User, getUserById, addUser, getUserByUsername  } from './db/users';
import {viewsDirectory} from '../consts';

interface JwtDecodedPayload {
    userId: string;
}

const JWT_ENCRYPTION_KEY = process.env.PRIVATE_AUTH_KEY;

const jwtStrategyOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: JWT_ENCRYPTION_KEY,
    passReqToCallback: true,
};

const PassportJWTStrategy = new Strategy(
    jwtStrategyOptions,
    (req: Request, jwtDecoded: JwtDecodedPayload, done: VerifiedCallback) => {

        if (!jwtDecoded.userId) {
            throw new Error('bad JWT');
        }

        getUserById(jwtDecoded.userId)
            .then((user) => {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            }).catch(err => {
                return done(err, false);
            });
    });


export function setupPPAuthentication(app: Application) {

    passport.use(PassportJWTStrategy);



    app.use(passport.initialize());

    app.get('/auth', (req, res) => {
        res.sendFile('login.html', {root: viewsDirectory});
    });

    app.post('/register', async (req, res) => {
        try {
            const adminUser = await addUser({
                username: req.body.username,
                password: req.body.password,
            });

            res.json({
                adminUser
            });
        } catch (error) {
            res.json({
                error: error.message
            });
        }
    });

    app.post('/login', async (req, res, next) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                throw new Error('Username or password not provided');
            }

            const user = await getUserByUsername(username);

            if (!user) {
                throw new Error(`User with username : "${username}" could not be found`);
            }

            if (!await user.comparePassword(password)) {
                throw new Error('User password incorrect');
            }

            const jwtDecoded: JwtDecodedPayload = {
                userId: user._id.toString(),
            };

            const authToken = jwt.sign(jwtDecoded, jwtStrategyOptions.secretOrKey);

            res.json({ authToken, _id: user._id });

        } catch (error) {
            res.json({
                error: error.message
            });
        }
    });



}
