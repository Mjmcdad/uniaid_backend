const express = require('express');
const router = express.Router();
const lectureController = require('../Controllers/lectureController');

router.post('/createLecture', lectureController.createLecture);
router.put('/updateLecture/:id', lectureController.updateLecture);
router.delete('/deleteLecture/:id', lectureController.deleteLecture);

module.exports = router;
