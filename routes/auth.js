const express = require('express');
const { validate } = require('express-validation');

const authController = require('../controllers/auth');
const { requireAuth } = require('../middlewares/auth');
const { register } = require('../validations/auth.validation');

const router = express.Router();

router.post(
  '/register',
  authController.register,
);

router.get('/:wallet', authController.getUser);

router.get('/logout', authController.logout);

module.exports = router;