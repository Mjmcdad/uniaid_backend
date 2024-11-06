const express = require('express');
const router = express.Router();
const transactionController = require('../Controllers/transactionController');

router.post('/createTransaction', transactionController.createTransaction);
router.get('/getAllTransactions', transactionController.getAllTransactions);
router.get('/getTransactionByStudentId/:studentId', transactionController.getTransactionByStudentId);
router.get('/getTransactionBySubjectId/:subjectId', transactionController.getTransactionBySubjectId);
router.put('/updateTransaction/:id', transactionController.updateTransaction);

module.exports = router;
