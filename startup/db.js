const mongoose = require('mongoose');
const { dbURI } = require('../config/keys/keys');

module.exports = function () {
  mongoose
    .connect(dbURI, {
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
