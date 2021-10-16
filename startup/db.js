const mongoose = require('mongoose');
require('dotenv').config();

module.exports = function () {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err =>
      console.log('Some error occured while connecting to MongoDB')
    );
};
