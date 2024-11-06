const express = require('express');
const router = express.Router();
const assignmentsController = require('../Controllers/assginmentsController');

router.post('/createAssignment', assignmentsController.createAssignment);
router.put('/updateAssignment/:id', assignmentsController.updateAssignment);
router.delete('/deleteAssignment/:id', assignmentsController.deleteAssignment);



module.exports = router;
