const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
  date: {
    type: Date,
    default: Date.now,
  },
});

Schema.methods.getToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
      name: this.name,
    },
    process.env.SECRET_KEY,
    {
      algorithm: 'HS256',
      expiresIn: 3600,
    }
  );

  return `Bearer ${token}`;
};

Schema.methods.getRememberToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
      name: this.name,
    },
    process.env.SECRET_KEY,
    {
      algorithm: 'HS256',
    }
  );
  return `Bearer ${token}`;
};

const User = mongoose.model('users', Schema);

module.exports = User;
