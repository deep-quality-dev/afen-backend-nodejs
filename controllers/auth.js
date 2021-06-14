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

  User.findOne({ email }, (emailErr, existingEmailUser) => {
    if (emailErr) return next(emailErr);

    if (existingEmailUser) {
      return res.status(422).send({ message: 'This email is already in use.' });
    }

    User.findOne({ wallet }, (walletErr, existingWalletUser) => {
      if (walletErr) return next(walletErr);

      if (existingWalletUser) {
        return res.status(422).send({ message: 'This wallet address is already in use.' });
      }

      User.findOne({ name }, (nameErr, existingNameUser) => {
        if (nameErr) return next(nameErr);

        if (existingNameUser) {
          return res.status(422).send({ message: 'This user name is already in use.' });
        }

        const user = new User({
          name,
          email,
          portfolio,
          instagram,
          twitter,
          description,
          avatar,
          banner,
          wallet
        });
    
        user.save((err) => {
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
      })
    })
  });
};

exports.getUser = (req, res) => {
  User.findOne({ wallet: req.params.wallet })
    .then(user => {
      
      console.log(user)

      res.json({
        success: true,
        user
      });
    })
    .catch(() => {
      res.status(404).send({ message: 'User not found' });
    });
};

exports.logout = (req, res) => {
  req.logout();
  res.json({ message: 'Success' });
};