const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/keys/keys');

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
    SECRET_KEY,
    {
      expiresIn: 3600,
    }
  );
  return `Bearer ${token}`;
};

Schema.methods.getRememberToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
    },
    SECRET_KEY
  );
  return `Bearer ${token}`;
};

const User = mongoose.model('users', Schema);

module.exports = User;
