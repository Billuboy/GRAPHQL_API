module.exports = function (err, req, res, next) {
  throw new Error('INTERNAL_SERVER_ERROR', {
    errors: {
      server: 'Some Internal Server Error Occured',
    },
  });
};
