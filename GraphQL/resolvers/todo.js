const {
  UserInputError,
  AuthenticationError,
} = require('apollo-server-express');
const lodash = require('lodash');

const Todo = require('../../models/todo');
const validation = require('../../validations/todo/todo');
const objectIdValidation = require('../../validations/objectId');
const authMiddleware = require('../../middleware/auth');

module.exports = {
  //Queries
  Query: {
    //@access   Private
    //@desc     resolver for getting all todos of a user
    async getTodos(_, { username }, context) {
      const userObject = await authMiddleware(context);
      if (userObject.name !== username)
        throw new AuthenticationError('Invalid token', {
          errors: {
            token: 'Invalid token used',
          },
        });
      const response = await Todo.findOne({ user: userObject._id }).sort({
        date: -1,
      });
      return response;
    },
    //Query ends here
  },

  //Mutations
  Mutation: {
    //@access   Private
    //@desc     resolver for creating a new todo
    async createTodo(_, { task, username }, context) {
      const userObject = await authMiddleware(context);
      if (userObject.name !== username)
        throw new AuthenticationError('Invalid token', {
          errors: {
            token: 'Invalid token used',
          },
        });

      const { errors, isValid } = validation({ task });
      if (!isValid) throw new UserInputError('Wrong User Input', { errors });

      const result = await Todo.findOne({ user: userObject._id });
      if (!result) {
        const newUser = new Todo({ user: userObject._id });
        await newUser.save();
      }

      const todos = {
        task,
      };

      const response = await Todo.findOneAndUpdate(
        { user: userObject._id },
        {
          $push: {
            todos,
          },
        },
        { new: true }
      );

      return response;
    },

    //@access   Private
    //@desc     resolver for completing a todo
    async completeTodo(_, { todoId, username }, context) {
      const userObject = await authMiddleware(context);
      if (userObject.name !== username)
        throw new AuthenticationError('Invalid token', {
          errors: {
            token: 'Invalid token used',
          },
        });

      const { errors, isValid } = objectIdValidation(todoId);
      if (!isValid) throw new UserInputError('Wrong Todo ID', { errors });

      const user = await Todo.findOne({ user: userObject._id });
      const todos = user.todos;
      console.log(todos);
      const index = lodash.findIndex(
        todos,
        todo => String(todo._id) === todoId
      );
      console.log(index);

      if (index < 0)
        throw new UserInputError('No todo found', {
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
    async deleteTodo(_, { todoId, username }, context) {
      const userObject = await authMiddleware(context);
      if (userObject.name !== username)
        throw new AuthenticationError('Invalid token', {
          errors: {
            token: 'Invalid token used',
          },
        });

      const { errors, isValid } = objectIdValidation(todoId);
      if (!isValid) throw new UserInputError('Wrong Todo ID', { errors });

      const user = await Todo.findOne({ user: userObject._id });
      const index = lodash.findIndex(
        user.todos,
        todo => String(todo._id) === todoId
      );

      if (index < 0)
        throw new UserInputError('No todo found', {
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
