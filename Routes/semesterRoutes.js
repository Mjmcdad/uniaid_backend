const express = require('express');
const router = express.Router();
const semesterController = require('../Controllers/semseterController');

router.post('/', semesterController.create);
router.post('/:id/subject_offer', semesterController.createSubjectOffer);

router.put('/updateSemester/:id', semesterController.updateSemester);
router.delete('/deleteSemester/:id', semesterController.deleteSemester);
router.get('/:id', semesterController.get);
router.get('/', semesterController.index);

module.exports = router;
