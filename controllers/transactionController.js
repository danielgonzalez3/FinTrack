const TransactionModel = require('../models/transactionModel');

class TransactionController {
  static async createTransaction(req, res) {
    try {
      const result = await TransactionModel.create(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getTransaction(req, res) {
    try {
      const transaction = await TransactionModel.findById(req.params.id);
      if (!transaction) {
        return res.status(404).json({ success: false, error: 'Transaction not found' });
      }
      res.json({ success: true, data: transaction });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAllTransactions(req, res) {
    try {
      const filters = {
        account_id: req.query.account_id,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };
      const transactions = await TransactionModel.findAll(filters);
      res.json({ success: true, data: transactions });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateTransaction(req, res) {
    try {
      const result = await TransactionModel.update(req.params.id, req.body);
      if (result === 0) {
        return res.status(404).json({ success: false, error: 'Transaction not found' });
      }
      res.json({ success: true, data: result });
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
}

module.exports = TransactionController;