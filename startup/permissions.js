const { rule, shield, and, deny, allow } = require('graphql-shield');

const isAuthenticated = rule()((_, args, context) => {
  console.log('auth', context !== null);
  return context !== null;
});

const isReadingOwnData = rule()((_, { id }, context) => {
  console.log('own', context.id === id);
  return context.id === id;
});

const permissions = shield({
  Query: {
    '*': deny,
    getUser: and(isAuthenticated, isReadingOwnData),
    getTodos: and(isAuthenticated, isReadingOwnData),
    getReminders: and(isAuthenticated, isReadingOwnData),
  },
  Mutation: {
    '*': deny,
    register: allow,
    login: allow,
    changePassword: and(isAuthenticated, isReadingOwnData),
    createTodo: and(isAuthenticated, isReadingOwnData),
    completeTodo: and(isAuthenticated, isReadingOwnData),
    deleteTodo: and(isAuthenticated, isReadingOwnData),
    createRem: and(isAuthenticated, isReadingOwnData),
    createCustomRem: and(isAuthenticated, isReadingOwnData),
    deleteRem: and(isAuthenticated, isReadingOwnData),
  },
});

module.exports = permissions;
