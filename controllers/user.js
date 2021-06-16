const jwt = require('jsonwebtoken');

const config = require('../config');
const User = require('../models/user');

function generateToken(user) {
  return jwt.sign(user, config.secretOrKey, {
    expiresIn: 60 * config.jwtExpireMinutes,
  });
}

exports.register = (req, res, next) => {
  const {
    name,
    email,
    portfolio,
    instagram,
    twitter,
    description,
    avatar,
    banner,
    wallet,
  } = req.body;

  if (!name || !email || !wallet) {
    return res.status(422).sned({
      message: 'The Name, E-mail and Wallet Address should be valid.',
    });
  }

  User.findOne({ email }, (emailErr, existingEmailUser) => {
    if (emailErr) return next(emailErr);

    if (existingEmailUser) {
      return res.status(422).send({ message: 'This email is already in use.' });
    }

    User.findOne({ wallet }, (walletErr, existingWalletUser) => {
      if (walletErr) return next(walletErr);

      if (existingWalletUser) {
        return res
          .status(422)
          .send({ message: 'This wallet address is already in use.' });
      }

      User.findOne({ name }, (nameErr, existingNameUser) => {
        if (nameErr) return next(nameErr);

        if (existingNameUser) {
          return res
            .status(422)
            .send({ message: 'This user name is already in use.' });
        }

        const user = new User({
          name,
          email,
          wallet,
          portfolio: portfolio ?? '',
          instagram: instagram ?? '',
          twitter: twitter ?? '',
          description: description ?? '',
          avatar: avatar ?? '',
          banner: banner ?? '',
        });

        user.save(err => {
          if (err) return next(err);

          const userInfo = {
            name,
            email,
            portfolio,
            instagram,
            twitter,
            description,
            avatar,
            banner,
            wallet,
          };
          res.json({
            message: 'Register success!',
            user: userInfo,
          });
        });
      });
    });
  });
};

exports.getUser = async (req, res, next) => {
  const { wallet } = req.params;

  try {
    const user = await User.findOne({ wallet }).exec();

    if (!user) res.status(401).json({ message: 'User not found' });

    res.json({
      user,
      // token: `JWT ${generateToken(user)}`,
    });
  } catch (e) {
    next(e);
  }
};

exports.logout = (req, res) => {
  req.logout();
  res.json({ message: 'Success' });
};
