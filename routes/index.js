const express = require('express');
const { requireAuth } = require('../middlewares/auth');
const userRouter = require('./user');
const nftRouter = require('./nft');
const fileRouter = require('./file');
const transactionRouter = require('./transaction');

require('../config/passport');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'afen rest api' });
});

router.use('/user', userRouter);
router.use('/nft', nftRouter);
router.use('/file', requireAuth, fileRouter);
router.use('/transaction', requireAuth, transactionRouter);

module.exports = router;
