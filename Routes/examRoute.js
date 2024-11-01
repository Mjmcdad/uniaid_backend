const express = require('express');
const router = express.Router();
const examController = require('../Controllers/examController');

router.post('/createExam', examController.createExam);
router.put('/updateExam/:id', examController.updateExam);
router.delete('/deleteExam/:id', examController.deleteExam);
router.get('/getExamBySubjectOffer/:subjectOfferId', examController.getExamBySubjectOffer);
router.get('/getExamBySemester/:semesterId', examController.getExamBySemester);

module.exports = router;
