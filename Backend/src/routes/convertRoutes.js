const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const convertController = require('../controllers/convertController');

// POST /api/convert
router.post('/convert', upload.single('file'), convertController.convert);

module.exports = router;
