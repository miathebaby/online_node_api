const config = require('../config/index');
const User = require('../models/user');
const passport = require('passport');

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.JWT_SECRET;
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        // Supports both token shapes:
        // - jwt.sign(payload, ...)                -> { id, role, iat, exp }
        // - jwt.sign({ payload }, ...) (current)  -> { payload: { id, role }, iat, exp }
        const id = jwt_payload?.id || jwt_payload?.payload?.id;

        if (!id) {
            return done(null, false, { message: 'Invalid token payload' });
        }

        const user = await User.findById(id);
        if (!user) {
            // Return "unauthorized" instead of throwing 500
            return done(null, false, { message: 'User not found' });
        }

        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
}));

module.exports.isLoging = passport.authenticate('jwt', { session: false });