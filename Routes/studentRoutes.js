const express = require('express');
const router = express.Router();
const studentController = require('../Controllers/studentController');


router.post('/', studentController.createStudent);
router.post('/login', studentController.login);
router.post('/enrollment', studentController.createEnrollment);
router.put('/enrollment/:id', studentController.updateEnrollment);
router.get('/:id', studentController.get);
router.get('/:id/enrollment', studentController.getEnrollments);
router.get('/', studentController.index);


module.exports = router;