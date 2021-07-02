const express = require('express');

const transactionController = require('../controllers/transaction');

const router = express.Router();

router.post('/create', transactionController.create);

router.post('/list', transactionController.list);

module.exports = router;
