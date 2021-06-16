const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    isVerified: Boolean!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  type Query {
    getUser(userId: ID!): User!
    verifyUser(email: String!, username: String!): User!
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!, rememberMe: Boolean!): String!
    changePassword(username: String!, password: String!): User!
    resetPassword(userId: ID!, password: String!): User!
  }
`;
