const Joi = require('joi');

module.exports = function (body, res) {
  const schema = Joi.object({
    user: Joi.objectId(),
    birthday: Joi.object({
      date: Joi.date().required(),
      desc: Joi.string().required(),
    }),
    anniversary: Joi.object({
      date: Joi.date().required(),
      desc: Joi.string().required(),
    }),
    events: Joi.object({
      date: Joi.date().requried(),
      desc: Joi.string().required(),
    }),
    custom: Joi.object({
      date: Joi.date().required(),
      title: Joi.string().required(),
      desc: Joi.string().required(),
    }),
  });

  const result = schema.validate(body, { abortEarly: false });
  let errors = {};
  if (result.error) {
    result.error.details.forEach(err => {
      let path;
      if (err.path[0] === 'user') path = err.path[0];
      else path = err.path[1];

      errors[path] = err.message;
    });

    res.status(400).json(errors);
    return;
  }
  return 0;
};
