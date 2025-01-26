const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController');

router.post('/transactions', TransactionController.createTransaction);
router.get('/transactions', TransactionController.getAllTransactions);
router.get('/transactions/:id', TransactionController.getTransaction);
router.put('/transactions/:id', TransactionController.updateTransaction);
router.delete('/transactions/:id', TransactionController.deleteTransaction);

module.exports = router;