const Joi = require('joi');

module.exports = function (body) {
  const schema = Joi.object({
    date: Joi.date()
      .required()
      .error(errors => {
        errors.forEach(err => {
          switch (err.code) {
            case 'date.empty':
              err.message = "Date can't be empty";
              break;
            case 'any.required':
              err.message = 'Date is required';
            default:
              err.message = 'Date must be date';
              break;
          }
        });
        return errors;
      }),
    desc: Joi.string()
      .required()
      .error(errors => {
        errors.forEach(err => {
          switch (err.code) {
            case 'string.empty':
              err.message = "Description can't be empty";
              break;
            case 'any.required':
              err.message = 'Description is required';
            default:
              err.message = 'Description must be string';
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
