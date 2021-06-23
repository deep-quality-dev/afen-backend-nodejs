const express = require('express');

const fileController = require('../controllers/file');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.post('/upload', fileController.upload);

module.exports = router;
