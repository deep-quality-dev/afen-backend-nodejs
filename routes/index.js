const express = require('express');
const userRouter = require('./user');
// const { requireAuth } = require('../middlewares/auth');

require('../config/passport');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'afen rest api' });
});

router.use('/user', userRouter);

module.exports = router;