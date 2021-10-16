const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');

const typeDefs = require('../GraphQL/typeDefs');
const resolvers = require('../GraphQL/resolvers');
const permissions = require('./permissions');

module.exports = app => {
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema: applyMiddleware(schema, permissions),
    context: ({ req }) => req.user || null,
    introspection: true,
    playground: true,
  });

  server.applyMiddleware({ app });

  const port = process.env.PORT || 3001;

  app.listen({ port }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
  });
};
