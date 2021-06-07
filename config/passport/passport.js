const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../../models/user');
const { secretKey } = require('../keys/keys');

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretKey;

module.exports = passport => {
  console.log('Passport');
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      const user = await User.findOne({ _id: jwt_payload._id }).select({
        password: 0,
        email: 0,
        date: 0,
      });

      if (user) return done(null, user);
      return done(null, false);
    })
  );
};
