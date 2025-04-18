const express = require('express');
const router = express.Router();
const studentController = require('../Controllers/studentController');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post('/createStudent', studentController.createStudent);
router.put('/updateStudent/:id', studentController.updateStudent);
router.delete('/deleteStudent/:id', studentController.deleteStudent);
router.get('/getStudentByName/:firstName/:lastName', studentController.getStudentByName);
router.get('/getStudentById/:id', studentController.getStudentById);
router.get('/getAllStudents', studentController.getAllStudents);
router.post('/login', studentController.login);

module.exports = router;