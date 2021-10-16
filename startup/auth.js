const expressJwt = require('express-jwt');
require('dotenv').config();

module.exports = app => {
  app.use(
    expressJwt({
      secret: process.env.SECRET_KEY,
      algorithms: ['HS256'],
      credentialsRequired: false,
      getToken: req => {
        if (
          req.headers.authorization &&
          req.headers.authorization.split(' ')[0] === 'Bearer'
        )
          return req.headers.authorization.split(' ')[1];

        return null;
      },
    })
  );
};
