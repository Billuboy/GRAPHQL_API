const { UserInputError } = require('apollo-server-express');
const lodash = require('lodash');

const Rem = require('../../models/reminder');
const validation = require('../../validations/reminder/reminder');
const titleValidation = require('../../validations/reminder/titleValidation');
const objectIdValidation = require('../../validations/objectId');

module.exports = {
  //Queries
  Query: {
    //@access   Private
    //@desc     resolver for getting all reminders
    async getReminders(_, { id }) {
      const response = await Rem.findOne({ user: id }).sort({
        date: -1,
      });

      if (!response) {
        return {
          user: id,
          birthday: [],
          anniversary: [],
          events: [],
          custom: [],
        };
      }
      return response;
    },

    //Query ends here
  },

  //Mutations
  Mutation: {
    //@access   Private
    //@desc     resolver for creating a reminder
    async createRem(_, { date, desc, id, remType }) {
      const { errors, isValid } = validation({ date, desc });
      if (!isValid) return new UserInputError('Wrong User Input', { errors });

      const reminderBody = {
        date,
        desc,
      };

      const response = await Rem.findOneAndUpdate(
        { user: id },
        {
          $push: {
            [remType]: reminderBody,
          },
        },
        { new: true, upsert: true }
      );

      return response;
    },

    //@access   Private
    //@desc     resolver for creating custom reaminder
    async createCustomRem(_, { date, desc, title, id }) {
      let validate = validation({ date, desc });
      if (!validate.isValid)
        return new UserInputError('Wrong User Input', {
          errors: validate.errors,
        });

      validate = titleValidation({ title });
      if (!validate.isValid)
        return new UserInputError('Wrong User Input', {
          errors: validate.errors,
        });

      const reminderBody = {
        date,
        desc,
        title,
      };

      const response = await Rem.findOneAndUpdate(
        { user: id },
        {
          $push: {
            custom: reminderBody,
          },
        },
        { new: true, upsert: true }
      );

      return response;
    },

    //@access   Private
    //@desc     resolver for deleting a reminder
    async deleteRem(_, { id, remId, remType }) {
      const { errors, isValid } = objectIdValidation(remId);
      if (!isValid) return new UserInputError('Wrong Reminder ID', { errors });

      const user = await Rem.findOne({ user: id });
      const index = lodash.findIndex(
        user[remType],
        rem => String(rem._id) === remId
      );

      if (index < 0)
        return new UserInputError('No reminder found', {
          errors: {
            todo: 'No reminder found with given Reminder ID',
          },
        });

      user[remType].splice(index, 1);

      const response = await user.save();
      return response;
    },

    //Mutation ends here
  },
};
