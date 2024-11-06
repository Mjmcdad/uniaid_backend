const express = require('express');
const router = express.Router();
const markSplitController = require('../Controllers/markSplitController');

router.post('/createMarkSplit', markSplitController.createMarkSplit);
router.put('/updateMarkSplit/:id', markSplitController.updateMarkSplit);
router.delete('/deleteMarkSplit/:id', markSplitController.deleteMarkSplit);
router.put('/updateAssignmentMark/:id', markSplitController.updateAssignmentMark);

module.exports = router;
