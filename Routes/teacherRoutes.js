const express = require('express');
const router = express.Router();
const teacherController = require('../Controllers/teacherController');

router.post('/', teacherController.createTeacher);
router.put('/:id', teacherController.updateTeacher);
router.delete('/:id', teacherController.deleteTeacher);
router.get('/:id', teacherController.getTeacherById);
router.get('/', teacherController.getAllTeachers);
router.post('/createTteacher', teacherController.createTteacher);
router.post('/createPteacher', teacherController.createPteacher);


module.exports = router;