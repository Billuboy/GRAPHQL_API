const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    isVerified: Boolean!
  }

  type Todo {
    id: ID!
    task: String!
    status: Boolean!
    date: String!
  }

  type Todos {
    user: ID!
    todos: [Todo!]
  }

  type Remainder {
    id: ID!
    date: String!
    desc: String!
    title: String!
  }

  type Remainders {
    user: ID!
    birthday: [Remainder!]
    anniversary: [Remainder!]
    events: [Remainder!]
    custom: [Remainder!]
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  type Query {
    getUser(userId: ID!): User!
    verifyUser(email: String!, username: String!): User!
    getTodos(username: String!): Todos!
    getRemainders(username: String!): Remainders!
  }

  type Mutation {
    register(registerInput: RegisterInput): String!
    login(email: String!, password: String!, rememberMe: Boolean!): String!
    changePassword(username: String!, password: String!): User!
    resetPassword(userId: ID!, password: String!): User!
    createTodo(task: String!, username: String!): Todos!
    completeTodo(todoId: ID!, username: String!): Todos!
    deleteTodo(todoId: ID!, username: String!): Todos!
    createRem(
      date: String!
      desc: String!
      username: String!
      remType: String!
    ): Remainders!
    createCustomRem(
      date: String!
      desc: String!
      title: String!
      username: String!
      remType: String!
    ): Remainders!
    deleteRem(remId: String!, username: String!, remType: String!): Remainders!
  }
`;
