const authResolver = require('./user');
const todoResolver = require('./todo');
const remResolver = require('./remainder');

module.exports = {
  Query: {
    ...authResolver.Query,
    ...todoResolver.Query,
    ...remResolver.Query,
  },
  Mutation: {
    ...authResolver.Mutation,
    ...todoResolver.Mutation,
    ...remResolver.Mutation,
  },
};
