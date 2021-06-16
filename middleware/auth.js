const { AuthenticationError } = require('apollo-server-express');

module.exports = async function (context) {
  const { user } = await context.authenticate('jwt', {
    session: false,
  });
  if (!user)
    throw new AuthenticationError('Unauthorized Access', {
      errors: {
        auth: 'Either JWT token is wrong or not provided',
      },
    });

  return user;
};
