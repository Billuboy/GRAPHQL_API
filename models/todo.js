const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  todos: [
    {
      task: {
        type: String,
        requried: true,
      },
      isDone: {
        type: Boolean,
        default: false,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Todo = mongoose.model('todos', Schema);

module.exports = Todo;
