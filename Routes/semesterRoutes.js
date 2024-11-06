const express = require('express');
const router = express.Router();
const semesterController = require('../Controllers/semseterController');

router.post('/createSemester', semesterController.createSemester);
router.put('/updateSemester/:id', semesterController.updateSemester);
router.delete('/deleteSemester/:id', semesterController.deleteSemester);
router.get('/getSemester/:id', semesterController.getSemester);

module.exports = router;
