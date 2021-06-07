const express = require('express');
const Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);
const app = express();

require('./startup/errorHandler')();
require('./startup/db')();
require('./startup/passport')(app);
require('./startup/routes')(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
