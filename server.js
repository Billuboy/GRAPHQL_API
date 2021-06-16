const express = require('express');
const Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);
const app = express();

//Initializing all resources
require('./startup/middlewareInit')(app);
require('./startup/db')();
require('./startup/apolloServer')(app);

// To run this api in your nodejs environment, initialize secret key and dbURI in keys/keys/dev_keys.js
