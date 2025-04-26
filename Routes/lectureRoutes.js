const express = require('express');
const router = express.Router();
const lectureController = require('../Controllers/lectureController');

router.get('/', lectureController.index);
router.post('/', lectureController.create);

module.exports = router;
