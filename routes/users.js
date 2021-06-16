const express = require('express');
const _ = require('lodash');
const passport = require('passport');
const bcrypt = require('bcrypt');

const router = express.Router();

const validate = require('../validations/user');
const User = require('../models/user');
const validateObjectId = require('../validations/objectId');
const uniqueString = require('../config/verification/uniqueStringGen')();
const mailSender = require('../config/verification/emailSender');

//@route   GET api/user/:id
//@desc    api for finding a particular user
//@access  private
router.get(
  '/:id',
  () => console.log(passport.authenticate('jwt', { session: false })),
  async (req, res) => {
    conosle.log(passport.authenticate('jwt', { session: false }));
    const result = validateObjectId(req.params.id, res);
    if (result === undefined) return;

    const response = await User.findOne({ _id: req.params.id }).select({
      password: 0,
      _id: 0,
    });
    if (!response)
      return res
        .status(404)
        .json({ user: "User with given objectId doesn't exist" });

    return res.json(response);
  }
);

//@route   GET api/user/verify
//@desc    api to verify email address
//@access  public
router.get('/verify/:id/:pin', async (req, res) => {
  const { id, pin } = req.params;
  let user = await User.findOne({ _id: id }).select({
    password: 0,
    date: 0,
  });

  if (!user)
    return res.status(404).json({ user: 'No user found with given id' });

  const validPin = await bcrypt.compare(pin, user.pin);
  if (validPin) {
    const response = await User.findOneAndUpdate(
      { _id: id },
      {
        $unset: { pin },
        $set: { isVerified: true },
      },
      { new: true }
    );

    return res.json(response);
  }

  await User.findOneAndRemove({ _id: id });
  return res.json({ deleted: true });
});

//@route   POST api/user/register
//@desc    api for registering user
//@access  public
router.post('/register', async (req, res) => {
  const result = validate(req.body, res);
  if (result === undefined) return;

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).json({ email: 'Email is already registered' });

  user = new User(_.pick(req.body, ['name', 'email', 'password']));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.pin = await bcrypt.hash(uniqueString, salt);

  await user.save();
  return mailSender(user.email, uniqueString, user._id, res);
});

//@route    POST api/user/login
//@desc     api for logging in a user
//@access   public
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(404)
      .json({ email: "User with given email id doesn't exist" });

  const passValid = await bcrypt.compare(req.body.password, user.password);
  if (!passValid)
    return res.status(404).json({ password: 'Incorrect email or password' });

  if (!user.isVerified) {
    return res.status(400).json({ verify: "Your account isn't verified" });
  }
  console.log(req.body.rememberMe);

  var token;
  if (req.body.rememberMe) token = user.getRememberToken();
  else token = user.getToken();

  return res.json({ token: `Bearer ${token}` });
});

module.exports = router;
