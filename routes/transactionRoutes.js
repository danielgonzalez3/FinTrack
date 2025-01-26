const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController');

router.get('/transactions', (req, res) => {
  TransactionController.getAllTransactions(req, res);
});

router.delete('/transactions/:id', TransactionController.deleteTransaction);

router.get('/categories', TransactionController.getAllCategories);

module.exports = router;