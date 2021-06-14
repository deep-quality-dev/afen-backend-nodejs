const express = require('express');
const authRouter = require('./auth');
const userRouter = require('./user');
const { requireAuth } = require('../middlewares/auth');

require('../config/passport');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'afen rest api' });
});

router.use('/auth', authRouter);
router.use('/user', requireAuth, userRouter);

module.exports = router;