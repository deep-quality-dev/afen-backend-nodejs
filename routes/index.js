const express = require('express');
const { requireAuth } = require('../middlewares/auth');
const userRouter = require('./user');
const nftRouter = require('./nft');

require('../config/passport');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'afen rest api' });
});

router.use('/user', userRouter);
router.use('/nft', nftRouter);

module.exports = router;
