// authMiddleware.js
import passport from 'passport';

function authenticateJWT(req, res, next) {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err || !user) {
            return next(new Error('Unauthorized'));
        }
        req.user = user;
        next(); // Continúa al siguiente middleware
    })(req, res, next);
}

export default authenticateJWT;
