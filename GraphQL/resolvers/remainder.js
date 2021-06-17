const {
  UserInputError,
  AuthenticationError,
} = require('apollo-server-express');
const lodash = require('lodash');

const Rem = require('../../models/remainder');
const validation = require('../../validations/remainder/remainder');
const titleValidation = require('../../validations/remainder/titleValidation');
const objectIdValidation = require('../../validations/objectId');
const authMiddleware = require('../../middleware/auth');

module.exports = {
  //Queries
  Query: {
    //@access   Private
    //@desc     resolver for getting all remainders
    async getRemainders(_, { username }, context) {
      const userObject = await authMiddleware(context);
      if (userObject.name !== username)
        throw new AuthenticationError('Invalid token', {
          errors: {
            token: 'Invalid token used',
          },
        });

      const response = await Rem.findOne({ user: userObject._id }).sort({
        date: -1,
      });
      return response;
    },

    //Query ends here
  },

  //Mutations
  Mutation: {
    //@access   Private
    //@desc     resolver for creating a reaminder
    async createRem(_, { date, desc, username, remType }, context) {
      const userObject = await authMiddleware(context);
      if (userObject.name !== username)
        throw new AuthenticationError('Invalid token', {
          errors: {
            token: 'Invalid token used',
          },
        });

      const { errors, isValid } = validation({ date, desc });
      if (!isValid) throw new UserInputError('Wrong User Input', { errors });

      const result = await Rem.findOne({ user: userObject._id });
      if (!result) {
        const newUser = new Rem({ user: userObject._id });
        await newUser.save();
      }

      const remainderBody = {
        date,
        desc,
      };

      const response = await Rem.findOneAndUpdate(
        { user: userObject._id },
        {
          $push: {
            [remType]: remainderBody,
          },
        },
        { new: true }
      );

      return response;
    },

    //@access   Private
    //@desc     resolver for creating custom reaminder
    async createCustomRem(_, { date, desc, title, username }, context) {
      const userObject = await authMiddleware(context);
      if (userObject.name !== username)
        throw new AuthenticationError('Invalid token', {
          errors: {
            token: 'Invalid token used',
          },
        });

      let validate = validation({ date, desc });
      if (!validate.isValid)
        throw new UserInputError('Wrong User Input', {
          errors: validate.errors,
        });

      validate = titleValidation({ title });
      if (!validate.isValid)
        throw new UserInputError('Wrong User Input', {
          errors: validate.errors,
        });

      const result = await Rem.findOne({ user: userObject._id });
      if (!result) {
        const newUser = new Rem({ user: userObject._id });
        await newUser.save();
      }

      const remainderBody = {
        date,
        desc,
        title,
      };

      const response = await Rem.findOneAndUpdate(
        { user: userObject._id },
        {
          $push: {
            custom: remainderBody,
          },
        },
        { new: true }
      );

      return response;
    },

    //@access   Private
    //@desc     resolver for deleting a remainder
    async deleteRem(_, { remId, username, remType }, context) {
      const userObject = await authMiddleware(context);
      if (userObject.name !== username)
        throw new AuthenticationError('Invalid token', {
          errors: {
            token: 'Invalid token used',
          },
        });

      const { errors, isValid } = objectIdValidation(remId);
      if (!isValid) throw new UserInputError('Wrong Remainder ID', { errors });

      const user = await Rem.findOne({ user: userObject._id });
      const index = lodash.findIndex(
        user[remType],
        rem => String(rem._id) === remId
      );

      if (index < 0)
        throw new UserInputError('No remainder found', {
          errors: {
            todo: 'No remainder found with given Remainder ID',
          },
        });

      user[remType].splice(index, 1);

      const response = await user.save();
      return response;
    },

    //Mutation ends here
  },
};
