const passport = require('passport');

module.exports = function (app) {
  app.use(passport.initialize());
  require('../config/passport/passport')(passport);
};
