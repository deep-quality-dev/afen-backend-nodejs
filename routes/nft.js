const express = require('express');

const nftController = require('../controllers/nft');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.post('/create', nftController.create);

router.post('/update', nftController.update);

router.get('/:id', nftController.get);

router.post('/list', nftController.list);

module.exports = router;
