const express = require('express');
const Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);
const app = express();

//Initializing all resources
require('./startup/auth')(app);
require('./startup/db')();
require('./startup/apolloServer')(app);
