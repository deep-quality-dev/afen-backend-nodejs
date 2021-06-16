const { Joi } = require('express-validation');

module.exports = {
  register: {
    body: Joi.object({
      name: Joi.string().required().pattern(new RegExp('[a-zA-Z]+$')),
      email: Joi.string().email().required(),
      wallet: Joi.string().required(),
      portfolio: Joi.string(),
      instagram: Joi.string(),
      twitter: Joi.string(),
      description: Joi.string(),
      avatar: Joi.string(),
      banner: Joi.string(),
    }),
  },
};
