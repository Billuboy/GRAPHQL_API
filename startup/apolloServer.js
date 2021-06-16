const { ApolloServer } = require('apollo-server-express');
const { buildContext } = require('graphql-passport');

const typeDefs = require('../GraphQL/typeDefs');
const resolvers = require('../GraphQL/resolvers');
const User = require('../models/user');

module.exports = app => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => buildContext({ req, res, User }),
  });

  server.applyMiddleware({ app, cors: false });

  const PORT = process.env.PORT || 3001;

  app.listen({ port: PORT }, () => {
    console.log(
      `Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
};
