const db = require('../config/db');

class TransactionModel {
 static async findAll(filters = {}) {
   const { category, startDate, endDate, type = 'transactions' } = filters;
   
   // validate
   if (category && typeof category !== 'string') {
     console.warn(`[TransactionModel.findAll] 'category' should be a string. Received: ${category}`);
   }
   const isStartDateValid = !startDate || !isNaN(new Date(startDate).getTime());
   const isEndDateValid = !endDate || !isNaN(new Date(endDate).getTime());
   
   // base query
   let query;
   switch(type) {
     case 'expenses':
       query = db('expenses');
       break;
     case 'income': 
       query = db('income');
       break;
     default:
       query = db('transactions');
   }

   // filters
   if (category) {
     query.where('category', category);
   }
   if (isStartDateValid && startDate) {
     query.where('transacted_at', '>=', startDate);
   }
   if (isEndDateValid && endDate) {
     query.where('transacted_at', '<=', endDate);
   }

   try {
     const results = await query;
     console.log(`[TransactionModel.findAll] Found ${results.length} records from ${type} table`);
     return results;
   } catch (error) {
     console.error('[TransactionModel.findAll] Error:', error);
     throw error;
   }
 }

  static async delete(transactionId) {
    if (typeof transactionId !== 'string' || transactionId.trim() === '') {
      console.error(`[deleteTransaction] Invalid transactionId: Must be a non-empty string. Received: '${transactionId}'`);
      return null;
    }

    console.log(`[deleteTransaction] Attempting to delete transaction with ID: ${transactionId}`);

    try {
      const result = await db('transactions')
        .where('transaction_id', transactionId)
        .del();

      if (result === 0) {
        console.warn(`[deleteTransaction] No records found with transaction_id = '${transactionId}'. Nothing was deleted.`);
      } else {
        console.log(`[deleteTransaction] Successfully deleted ${result} record(s) for transaction_id = '${transactionId}'.`);
      }
      return result;
    } catch (error) {
      console.error(`[deleteTransaction] Error deleting transaction with ID '${transactionId}':`, error);
    }
  }

  static async getUniqueCategories() {
   try {
     console.log("[Categories] Querying database");
     const categoriesObjArray = await db.distinct('category')
       .from('transactions')
       .orderBy('category');
     const categories = categoriesObjArray.map(item => item.category);
     console.log("[Categories] Query results:", categories);
     return categories;
   } catch (error) {
     console.error("[Categories] Database error:", error.code, error.message);
     throw error;
   }
  }
}

module.exports = TransactionModel;