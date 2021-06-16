const express = require('express');
const passport = require('passport');

const error = require('../middleware/error');

module.exports = app => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(passport.initialize());
  require('../config/passport/passport')(passport);

  app.use(error);
};
