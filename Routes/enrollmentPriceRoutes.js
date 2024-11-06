const express = require('express');
const router = express.Router();
const enrollmentPriceController = require('../Controllers/enrollmentPriceController');

router.post('/createEnrollmentPrice', enrollmentPriceController.createEnrollmentPrice);
router.put('/updateEnrollmentPrice/:id', enrollmentPriceController.updateEnrollmentPrice);
router.delete('/deleteEnrollmentPrice/:id', enrollmentPriceController.deleteEnrollmentPrice);

module.exports = router;
