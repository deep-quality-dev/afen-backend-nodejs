const express = require('express');
const { validate } = require('express-validation');

const userController = require('../controllers/user');
const { requireAuth } = require('../middlewares/auth');
const { register, login } = require('../validations/auth.validation');

const router = express.Router();

router.post(
  '/register',
  validate(register, { context: false, statusCode: 400, keyByField: true }),
  userController.register,
);

router.post(
  '/login',
  validate(login, { context: false, statusCode: 400, keyByField: true }),
  userController.login,
);

router.get('/logout', requireAuth, userController.logout);

router.get('/:id', userController.getUser);

router.post('/update', requireAuth, userController.update);

router.delete('/:wallet', requireAuth, userController.delete);

module.exports = router;
