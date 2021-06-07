const nodemailer = require('nodemailer');
const { gmailPass, gmailId } = require('../keys/keys');

module.exports = function (email, uniqueString, id, res) {
  var Transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: gmailId,
      pass: gmailPass,
    },
  });

  let sender = 'Billuboy';
  let mailOptions = {
    from: sender,
    to: email,
    subject: 'Email confirmation',
    html: `Press <a href=http://localhost:3000/verify/${id}/${uniqueString}> here </a> to verify your email.`,
  };

  Transport.sendMail(mailOptions, function (error, response) {
    if (error) {
      return res.status(400).json({ verify: error });
    }
    return res.json({ send: 'Email verification message sent successfully' });
  });
};
