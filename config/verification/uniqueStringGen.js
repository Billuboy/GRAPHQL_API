module.exports = function () {
  const length = 8;
  let randStr = '';
  for (let i = 0; i < length; i++) {
    const ch = Math.floor(Math.random() * 10 + 1);
    randStr += ch;
  }

  return randStr;
};
