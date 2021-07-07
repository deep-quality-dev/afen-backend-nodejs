const redis = require('redis');
const JWTR = require('jwt-redis').default;

const config = require('../config');
const User = require('../models/user');
const Query = require('../utils/query');

const redisClient =
  config.env === 'production'
    ? redis.createClient(config.redis_url)
    : redis.createClient();
const jwtr = new JWTR(redisClient);

function generateToken(user) {
  return jwtr.sign(user, config.secretOrKey, {
    expiresIn: 60 * config.jwtExpireMinutes,
  });
}

exports.register = (req, res, next) => {
  const {
    name,
    email,
    password,
    portfolio,
    instagram,
    twitter,
    description,
    avatar,
    banner,
    wallet,
  } = req.body;

  if (!name || !email || !wallet) {
    return res.status(422).send({
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
          password,
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

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err) return next(err);

    if (!user)
      return res
        .status(422)
        .json({ message: 'Email or password is not correct!' });

    user.comparePassword(password, (err, isMatch) => {
      if (err)
        return res
          .status(500)
          .json({ message: 'Something went wrong, please try again' });

      if (!isMatch)
        return res
          .status(422)
          .json({ message: 'Email or password is not correct!' });

      generateToken({
        email,
        wallet: user.wallet,
      })
        .then(token => {
          return res.json({
            message: 'Login success',
            user,
            token,
          });
        })
        .catch(() => {
          return res
            .status(500)
            .json({ message: 'Something went wrong, please try again' });
        });
    });
  });
};

exports.getUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ _id: id }).exec();

    if (!user) res.status(422).json({ message: 'User not found' });

    res.json({ user });
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const user = req.body;

    if (!user._id)
      return res.status(400).send({ message: 'User Id is missed.' });

    if (user.name) {
      const existingUser = await User.findOne({ name: user });
      if (user._id !== existingUser._id) {
        res
          .status(400)
          .send({
            message: 'This username is already in use. Please try another one.',
          });
      }
    }

    const filter = { _id: Query.getQueryByField(Query.OPERATORS.EQ, user._id) };

    await User.findOneAndUpdate(filter, user);

    const newUser = await User.findOne(filter);

    res.json({ message: 'User updated successfully!', user: newUser });
  } catch (e) {
    next(e);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { wallet } = req.params;

    const user = await User.findOne({ wallet }).exec();

    if (!user) return res.status(422).json({ message: 'User not found' });

    await User.deleteOne({ wallet }).exec();

    res.json({ user });
  } catch (e) {
    next(e);
  }
};

exports.logout = (req, res) => {
  if (req.headers.authorization) {
    jwtr.destroy(req.headers.authorization.replace('JWT ', '')).finally(() => {
      req.logout();
      res.json({ message: 'Success' });
    });
  }
};
