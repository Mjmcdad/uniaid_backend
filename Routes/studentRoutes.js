const express = require('express');
const router = express.Router();
const studentController = require('../Controllers/studentController');


router.post('/', studentController.createStudent);
router.post('/login', studentController.login);
router.post('/enrollment', studentController.createEnrollment);
router.put('/updateStudent/:id', studentController.updateStudent);
router.delete('/deleteStudent/:id', studentController.deleteStudent);
router.get('/getStudentByName/:firstName/:lastName', studentController.getStudentByName);
router.get('/:id', studentController.get);
router.get('/', studentController.index);


module.exports = router;