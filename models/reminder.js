const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  birthday: [
    {
      date: {
        type: Date,
        required: true,
      },
      desc: {
        type: String,
        required: true,
      },
    },
  ],
  anniversary: [
    {
      date: {
        type: Date,
        required: true,
      },
      desc: {
        type: String,
        required: true,
      },
    },
  ],
  events: [
    {
      date: {
        type: Date,
        required: true,
      },
      desc: {
        type: String,
        required: true,
      },
    },
  ],
  custom: [
    {
      date: {
        type: Date,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      desc: {
        type: String,
        required: true,
      },
    },
  ],
});

const Reminders = mongoose.model('reminders', Schema);

module.exports = Reminders;
