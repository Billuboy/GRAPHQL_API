const Joi = require('joi');

module.exports = function (body) {
  const schema = Joi.object({
    title: Joi.string()
      .required()
      .error(errors => {
        errors.forEach(err => {
          switch (err.code) {
            case 'string.empty':
              err.message = "Title can't be empty";
              break;
            case 'any.required':
              err.message = 'Title is required';
            default:
              err.message = 'Title must be string';
              break;
          }
        });
        return errors;
      }),
  });

  const result = schema.validate(body, { abortEarly: false });
  let errors = {};
  if (result.error) {
    result.error.details.forEach(err => {
      let path = err.path[0];
      errors[path] = err.message;
    });
  }

  return {
    errors,
    isValid: Object.keys(errors) < 1,
  };
};
