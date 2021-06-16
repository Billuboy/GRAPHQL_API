const Joi = require('joi');

module.exports = function (body) {
  const schema = Joi.object({
    password: Joi.string()
      .min(8)
      .max(30)
      .required()
      .error(errors => {
        errors.forEach(err => {
          switch (err.code) {
            case 'string.empty':
              err.message = "Password can't be empty";
              break;
            case 'string.min':
              err.message = `Password must be at least ${err.local.limit} characters long`;
              break;
            case 'string.max':
              err.message = `Password must be at most ${err.local.limit} characters long`;
              break;
            case 'any.required':
              err.message = `Password is required`;
            default:
              err.message = 'Password must be string';
              break;
          }
        });
        return errors;
      }),
  });

  const result = schema.validate(body);
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
