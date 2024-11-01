const express = require('express');
const router = express.Router();
const studentController = require('../Controllers/studentController');

router.post('/createStudent', studentController.createStudent);
router.put('/updateStudent/:id', studentController.updateStudent);
router.delete('/deleteStudent/:id', studentController.deleteStudent);
router.get('/getStudentByName/:firstName/:lastName', studentController.getStudentByName);
router.get('/getStudentById/:id', studentController.getStudentById);
router.get('/getAllStudents', studentController.getAllStudents);


module.exports = router;