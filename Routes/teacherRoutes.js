const express = require('express');
const router = express.Router();
const teacherController = require('../Controllers/teacherController');

router.post('/createTeacher', teacherController.createTeacher);
router.put('/updateTeacher/:id', teacherController.updateTeacher);
router.delete('/deleteTeacher/:id', teacherController.deleteTeacher);
router.get('/getTeacherByName/:firstName/:lastName', teacherController.getTeacherByName);       
router.get('/getTeacherById/:id', teacherController.getTeacherById);
router.get('/getAllTeachers', teacherController.getAllTeachers);
router.post('/createTteacher', teacherController.createTteacher);
router.post('/createPteacher', teacherController.createPteacher);


module.exports = router;