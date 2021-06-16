const authResolver = require('./authResolver');

module.exports = {
  Query: {
    ...authResolver.Query,
  },
  Mutation: {
    ...authResolver.Mutation,
  },
};
