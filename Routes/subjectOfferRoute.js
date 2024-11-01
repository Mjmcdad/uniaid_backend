const express = require('express');
const router = express.Router();
const subjectOfferController = require('../Controllers/subjectOfferController');

router.post('/createSubjectOffer', subjectOfferController.createSubjectOffer);
router.put('/updateSubjectOffer/:id', subjectOfferController.updateSubjectOffer);
router.delete('/deleteSubjectOffer/:id', subjectOfferController.deleteSubjectOffer);
router.get('/getSubjectOfferBySemester/:semesterId', subjectOfferController.getSubjectOfferBySemester);

module.exports = router;