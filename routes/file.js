const express = require('express');

const fileController = require('../controllers/file');

const router = express.Router();

router.post('/upload', fileController.upload);

module.exports = router;
