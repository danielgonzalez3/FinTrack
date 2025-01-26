const TransactionModel = require('../models/transactionModel');

class TransactionController {
  static async getAllTransactions(req, res) {
    try {
      const filters = {
        category: req.query.category,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        type: req.query.type || 'transactions'
      };
      const transactions = await TransactionModel.findAll(filters);
      res.json({ success: true, data: transactions });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async deleteTransaction(req, res) {
    try {
      const result = await TransactionModel.delete(req.params.id);
      if (result === 0) {
        return res.status(404).json({ success: false, error: 'Transaction not found' });
      }
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAllCategories(req, res) {
    try {
      const categories = await TransactionModel.getUniqueCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }
}

module.exports = TransactionController;