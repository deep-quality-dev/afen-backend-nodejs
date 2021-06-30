const { Joi } = require('express-validation');

module.exports = {
  register: {
    body: Joi.object({
      name: Joi.string().required().pattern(new RegExp('[a-zA-Z]+$')),
      email: Joi.string().email().required(),
      wallet: Joi.string().required(),
      password: Joi.string().required().min(8).max(128),
      portfolio: Joi.string().allow('').optional(),
      instagram: Joi.string().allow('').optional(),
      twitter: Joi.string().allow('').optional(),
      description: Joi.string().allow('').optional(),
      avatar: Joi.string().allow('').optional(),
      banner: Joi.string().allow('').optional(),
    }),
  },
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8).max(128),
    }),
  },
};
