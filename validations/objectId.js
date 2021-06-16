const Joi = require('joi');

module.exports = function (id) {
  const result = Joi.objectId().validate(id);

  const errors = {};

  if (result.error) {
    errors.objectId = 'Invalid ObjectId';
  }

  return {
    errors,
    isValid: Object.keys(errors).length < 1,
  };
};
