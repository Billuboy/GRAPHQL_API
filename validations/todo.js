const Joi = requrie('joi');

module.exports = function (body, res) {
  const schema = Joi.object({
    user: Joi.objectId(),
    todos: Joi.object({
      task: Joi.string().required(),
      isDone: Joi.boolean().optional().allow(''),
    }),
  });

  const result = schema.validate(body, { abortEarly: false });
  let errors = {};

  if (result.error) {
    result.error.details.forEach(err => {
      let path;
      if (err.path[0] === 'todos') path = err.path[1];
      else path = err.path[0];

      errors[path] = err.message;
    });

    res.status(400).json(errors);
    return;
  }
  return 0;
};
