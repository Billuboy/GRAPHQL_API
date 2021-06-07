const express = require('express');

const user = require('../routes/users');
// const todo = require('../routes/todos');
// const remainder = require('../routes/remainders');
const error = require('../middleware/error');

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use('/api/user/', user);
  // app.use('/api/todo/', todo);
  // app.use('/api/remainder/', remainder);
  // app.use(error);
};
