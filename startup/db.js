const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config/keys/keys');

module.exports = function () {
  mongoose
    .connect(MONGODB_URI, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err =>
      console.log('Some error occured while connecting to MongoDB')
    );
};
