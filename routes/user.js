const express = require('express');
// const { validate } = require('express-validation');

const userController = require('../controllers/user');
// const { requireAuth } = require('../middlewares/auth');
// const { register } = require('../validations/auth.validation');

const router = express.Router();

router.post('/register', userController.register);

router.get('/:wallet', userController.getUser);

router.get('/logout', userController.logout);

module.exports = router;
