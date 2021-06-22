const express = require('express');

const nftController = require('../controllers/nft');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.post('/create', nftController.create);

router.post('/list', nftController.list);

module.exports = router;
