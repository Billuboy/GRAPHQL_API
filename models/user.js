const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/keys/keys');

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  pin: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

Schema.methods.getToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
    },
    secretKey,
    {
      expiresIn: 3600,
    }
  );
  return token;
};

Schema.methods.getRememberToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
    },
    secretKey
  );
  return token;
};

const User = mongoose.model('users', Schema);

module.exports = User;
