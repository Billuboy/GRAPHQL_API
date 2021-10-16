const { UserInputError } = require('apollo-server-express');
const lodash = require('lodash');

const Todo = require('../../models/todo');
const validation = require('../../validations/todo/todo');
const objectIdValidation = require('../../validations/objectId');

module.exports = {
  //Queries
  Query: {
    //@access   Private
    //@desc     resolver for getting all todos of a user
    async getTodos(_, { id, status }) {
      const user = await Todo.findOne({user: id});

      if (!user) {
        return {
          user: id,
          todos: [],
        };
      }

      let response = {};
      response.user = user.user;
      response.todos = user.todos.filter(todo=>todo.status === status);

      return response;
    },
    //Query ends here
  },

  //Mutations
  Mutation: {
    //@access   Private
    //@desc     resolver for creating a new todo
    async createTodo(_, { id, task }) {
      const { errors, isValid } = validation({ task });
      if (!isValid) return new UserInputError('Wrong User Input', { errors });

      const todos = {
        task,
      };

      const response = await Todo.findOneAndUpdate(
        { user: id },
        {
          $push: {
            todos,
          },
        },
        { new: true, upsert: true }
      ).select({
        todos: 1,
        _id: 0,
        user: 1,
      });

      return response;
    },

    //@access   Private
    //@desc     resolver for completing a todo
    async completeTodo(_, { id, todoId }) {
      const { errors, isValid } = objectIdValidation(todoId);
      if (!isValid) return new UserInputError('Wrong Todo ID', { errors });

      const user = await Todo.findOne({ user: id });
      const { todos } = user;
      const index = lodash.findIndex(
        todos,
        todo => String(todo._id) === todoId
      );

      if (index < 0)
        return new UserInputError('No todo found', {
          errors: {
            todo: 'No todo found with given Todo ID',
          },
        });

      const status = user.todos[index].status;
      user.todos[index].status = !status;

      const response = await user.save();

      return response;
    },

    //@access   Private
    //@desc     resolver for deleting a particular todo
    async deleteTodo(_, { id, todoId }) {
      const { errors, isValid } = objectIdValidation(todoId);
      if (!isValid) return new UserInputError('Wrong Todo ID', { errors });

      const user = await Todo.findOne({ user: id });
      const index = lodash.findIndex(
        user.todos,
        todo => String(todo._id) === todoId
      );

      if (index < 0)
        return new UserInputError('No todo found', {
          errors: {
            todo: 'No todo found with given Todo ID',
          },
        });

      user.todos.splice(index, 1);

      const response = await user.save();
      return response;
    },

    //Mutation ends here
  },
};