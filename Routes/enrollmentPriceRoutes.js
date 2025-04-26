const express = require('express');
const router = express.Router();
const enrollmentPriceController = require('../Controllers/enrollmentPriceController');

router.post('/', enrollmentPriceController.create);
router.put('/updateEnrollmentPrice/:id', enrollmentPriceController.updateEnrollmentPrice);
router.delete('/deleteEnrollmentPrice/:id', enrollmentPriceController.deleteEnrollmentPrice);
router.get('/',enrollmentPriceController.index)
module.exports = router;
