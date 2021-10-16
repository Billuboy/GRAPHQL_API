const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    isVerified: Boolean!
  }

  type Todo {
    _id: ID!
    task: String!
    status: Boolean!
    date: String!
  }

  type Todos {
    user: ID!
    todos: [Todo!]
  }

  type Reminder {
    _id: ID!
    date: String!
    desc: String!
    title: String!
  }

  type Reminders {
    user: ID!
    birthday: [Reminder!]
    anniversary: [Reminder!]
    events: [Reminder!]
    custom: [Reminder!]
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  type Query {
    getUser(id: ID!): User!
    getTodos(id: ID!, status: Boolean!): Todos!
    getReminders(id: ID!): Reminders!
  }

  type Mutation {
    register(registerInput: RegisterInput): String!
    login(email: String!, password: String!, rememberMe: Boolean!): String!
    changePassword(id: ID!, password: String!): User!
    createTodo(id: ID!, task: String!): Todos!
    completeTodo(id: ID!, todoId: ID!): Todos!
    deleteTodo(id: ID!, todoId: ID!): Todos!
    createRem(
      id: ID!
      date: String!
      desc: String!
      remType: String!
    ): Reminders!
    createCustomRem(
      id: ID!
      date: String!
      desc: String!
      title: String!
    ): Reminders!
    deleteRem(id: ID!, remId: String!, remType: String!): Reminders!
  }
`;
