import * as passport from 'passport';


/**
 * If added to a express route, it will make the route require the auth token
 */
export function onlyAuthorized() {
    return passport.authenticate('jwt', { session: false });
}
