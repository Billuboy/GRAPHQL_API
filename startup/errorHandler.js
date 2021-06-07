module.exports = function (req, res) {
  process.on('unhandledRejection', err => {
    console.log({ error: err.message });
    process.exit(1);
  });
  process.on('uncuaghtException', err => {
    throw err;
  });
};
