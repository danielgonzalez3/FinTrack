const db = require('../config/db');

class TransactionModel {
  static async create(transaction) {
    return await db('transactions').insert(transaction);
  }

  static async findById(transactionId) {
    return await db('transactions')
      .where('transaction_id', transactionId)
      .first();
  }

  static async findAll(filters = {}) {
    const query = db('transactions');
    
    if (filters.account_id) {
      query.where('account_id', filters.account_id);
    }
    
    if (filters.startDate) {
      query.where('transacted_at', '>=', filters.startDate);
    }
    
    if (filters.endDate) {
      query.where('transacted_at', '<=', filters.endDate);
    }

    return await query;
  }

  static async update(transactionId, updates) {
    return await db('transactions')
      .where('transaction_id', transactionId)
      .update(updates);
  }

  static async delete(transactionId) {
    return await db('transactions')
      .where('transaction_id', transactionId)
      .del();
  }
}

module.exports = TransactionModel;