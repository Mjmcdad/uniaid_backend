const express = require('express');
const router = express.Router();
const subjectController = require('../Controllers/subjectController');

router.post('/createSubject', subjectController.createSubject);
router.delete('/deleteSubject/:id', subjectController.deleteSubjectById);
router.get('/getAllSubjects', subjectController.getAllSubjects);
router.delete('/deleteSubjectByName/:name', subjectController.deleteSubjectByName);
router.get('/getSubjectsByTeacher/:teacherId', subjectController.getSubjectsByTeacher);
router.get('/getSubjectDescriptionByName/:name', subjectController.getSubjectDescriptionByName);
module.exports = router;
