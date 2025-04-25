const express = require('express');
const router = express.Router();
const enrollmentController = require('../Controllers/enrollmentController');

router.put('/updateEnrollment/:id', enrollmentController.updateEnrollment);
router.delete('/deleteEnrollment/:id', enrollmentController.deleteEnrollment);
router.get('/getEnrollmentByStudentId/:studentId', enrollmentController.getEnrollmentByStudentId);
router.get('/getEnrollmentBySubjectOfferId/:subjectOfferId', enrollmentController.getEnrollmentBySubjectOfferId);
router.get('/getEnrollmentBySemester/:semesterId', enrollmentController.getEnrollmentBySemester);
router.get('/getUnenrolledSubjects/:studentId', enrollmentController.getUnenrolledSubjects);

module.exports = router;
