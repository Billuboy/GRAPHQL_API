const {
  UserInputError,
  AuthenticationError,
} = require('apollo-server-express');
const bcrypt = require('bcryptjs');

const User = require('../../models/user');
const validation = require('../../validations/user/user');
const objectIdValidation = require('../../validations/objectId');
const passwordValidate = require('../../validations/user/passwordValidate');
const authMiddleware = require('../../middleware/auth');

module.exports = {
  //Queries

  Query: {
    //@access   Private
    //@desc     resolver for getting a user
    async getUser(_, { userId }, context) {
      await authMiddleware(context);

      const { errors, isValid } = objectIdValidation(userId);
      if (!isValid) throw new UserInputError('Object Id', { errors });

      const response = await User.findById(userId);
      return response;
    },

    //@access   Public
    //@desc     resolver for verifying a user before sending otp on email
    async verifyUser(_, { email, username }) {
      const user = await User.findOne({ email });
      if (!user) throw new UserInputError('No user with given email exists');

      if (user.name !== username)
        throw new UserInputError('Incorrect Username');

      user.isVerified = true;
      const response = await user.save();

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
        throw new UserInputError("User with given email doesn't exist", {
          errors: {
            email: "User with given email doesn't exist",
          },
        });

      const passwordCheck = await bcrypt.compare(password, user.password);
      if (!passwordCheck)
        throw new UserInputError('Incorrect Password', {
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
      if (!isValid) throw new UserInputError('Errors', { errors });

      let user = await User.findOne({ email });
      if (user) {
        throw new UserInputError('User with given email id already exists', {
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
    async changePassword(_, { username, password }, context) {
      const userObject = await authMiddleware(context);
      if (userObject.name !== username)
        throw new AuthenticationError('Invalid token', {
          errors: {
            token: 'Invalid token used',
          },
        });

      if (!userObject.isVerified)
        throw new Error('User not verified', {
          errors: {
            user: 'User is not verified, verify user first',
          },
        });

      const { errors, isValid } = passwordValidate({ password });
      if (!isValid) throw new UserInputError('Password Error', { errors });

      const salt = await bcrypt.genSalt(12);
      password = await bcrypt.hash(password, salt);

      const response = await User.findOneAndUpdate(
        { _id: userObject._id },
        {
          $set: {
            password,
            isVerified: false,
          },
        },
        { new: true }
      );
      return response;
    },

    //@access   Public
    //@desc     resolver for changing password on forgot password
    async resetPassword(_, { userId, password }, context) {
      let result = objectIdValidation(userId);
      if (!result.isValid)
        throw new UserInputError('Object Id', { errors: result.errors });

      result = passwordValidate({ password });
      if (!result.isValid)
        throw new UserInputError('Password Error', { errors: result.errors });

      const salt = await bcrypt.genSalt(12);
      password = await bcrypt.hash(password, salt);

      const user = await User.findOne({ _id: userId });
      console.log(user);

      if (!user)
        throw new UserInputError('No user found', {
          errors: {
            user: 'No user found with given object id',
          },
        });

      if (!user.isVerified)
        throw new Error('User not verified', {
          errors: {
            user: 'User is not verified, verify user first',
          },
        });

      user.password = password;
      user.isVerified = false;
      const response = await user.save();

      return response;
    },

    // Mutation ends here
  },
};
