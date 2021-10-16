const { UserInputError } = require('apollo-server-express');
const bcrypt = require('bcryptjs');

const User = require('../../models/user');
const validation = require('../../validations/user/user');
const objectIdValidation = require('../../validations/objectId');
const passwordValidate = require('../../validations/user/passwordValidate');

module.exports = {
  //Queries

  Query: {
    //@access   Private
    //@desc     resolver for getting a user
    async getUser(_, { id }) {
      const { errors, isValid } = objectIdValidation(id);
      if (!isValid) return new UserInpuError('Object Id', { errors });

      const response = await User.findById(id);
      return response;
    },

    // Query ends here
  },

  //Mutations
  Mutation: {
    //@access   Public
    //@desc     resolver for logging in user
    async login(_, { email, password, rememberMe }) {
      const user = await User.findOne({ email });
      if (!user)
        return new UserInputError("User with given email doesn't exist", {
          errors: {
            email: "User with given email doesn't exist",
          },
        });

      const passwordCheck = await bcrypt.compare(password, user.password);
      if (!passwordCheck)
        return new UserInputError('Incorrect Password', {
          errors: {
            password: 'Incorrect Password',
          },
        });

      let token;
      if (rememberMe) token = user.getRememberToken();
      else token = user.getToken();

      return token;
    },

    //@access   Public
    //@desc     resolver for registering user
    async register(_, { registerInput: { name, email, password } }) {
      const { errors, isValid } = validation({ name, email, password });
      if (!isValid) return new UserInputError('Errors', { errors });

      let user = await User.findOne({ email });
      if (user) {
        return new UserInputError('User with given email id already exists', {
          errors: {
            email: 'User with given email id already exists',
          },
        });
      }

      const salt = await bcrypt.genSalt(12);
      password = await bcrypt.hash(password, salt);

      user = new User({ name, email, password });
      const token = user.getToken();
      await user.save();

      return token;
    },

    //@acess   Private
    //@desc    resolver for changing password of user on signing-in
    async changePassword(_, { id, password }) {
      const { errors, isValid } = passwordValidate({ password });
      if (!isValid) return new UserInputError('Password Error', { errors });

      const salt = await bcrypt.genSalt(12);
      password = await bcrypt.hash(password, salt);

      const response = await User.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            password,
          },
        },
        { new: true }
      );

      return response;
    },
    // Mutation ends here
  },
};
