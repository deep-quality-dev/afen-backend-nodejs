const express = require('express');

const nftController = require('../controllers/nft');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.post('/create', nftController.create);

module.exports = router;
