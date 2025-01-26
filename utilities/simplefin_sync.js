require('dotenv').config();
const axios = require('axios');
const dayjs = require('dayjs');
const knex = require('../config/db');
const { categorizeTransaction, loadConfig } = require('./transaction-categorizer');

let config = null;

async function initConfig() {
  if (!config) {
    config = await loadConfig();
  }
  return config;
}

class SimpleFinSync {
  constructor() {
    this.SIMPLEFIN_URL = process.env.SIMPLEFIN_URL;
  }

  async fetchTransactions(startDate, endDate) {
    try {
      const start = Math.floor(startDate.getTime() / 1000);
      const end = Math.floor(endDate.getTime() / 1000);
      
      const url = `${this.SIMPLEFIN_URL}/accounts?start-date=${start}&end-date=${end}`;      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching from SimpleFin:', error.message);
      throw error;
    }
  }

  async transformTransaction(transaction, accountInfo) {
    const categoryConfig = await initConfig();
    const category = categoryConfig ? 
      categorizeTransaction(transaction.description, categoryConfig) : 
      'uncategorized';

    return {
      transaction_id: transaction.id,
      account_id: accountInfo.id,
      account_name: accountInfo.name,
      currency: accountInfo.currency,
      posted: transaction.posted,
      amount: transaction.amount,
      description: transaction.description,
      payee: transaction.payee,
      memo: transaction.memo,
      transacted_at: transaction.transacted_at,
      category: category
    };
  }

  async storeTransactions(transactions) {
    const trx = await knex.transaction();
    try {
      const query = knex.raw(`
        INSERT INTO transactions (
          transaction_id, 
          account_id, 
          account_name, 
          currency, 
          posted, 
          amount, 
          description, 
          payee, 
          memo, 
          transacted_at,
          category
        ) 
        VALUES ?
        ON DUPLICATE KEY UPDATE 
          transaction_id=transaction_id,
          category=VALUES(category)
      `, [transactions.map(t => [
        t.transaction_id,
        t.account_id,
        t.account_name,
        t.currency,
        t.posted,
        t.amount,
        t.description,
        t.payee,
        t.memo,
        t.transacted_at,
        t.category
      ])]);
      await trx.raw(query.toString());
      await trx.commit();
      
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async sync30Days() {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 300);
      console.log(`Fetching transactions from ${startDate} to ${endDate}`);
      const simpleFinData = await this.fetchTransactions(startDate, endDate);
      const transformedTransactions = [];
      
      for (const account of simpleFinData.accounts) {
        const accountInfo = {
          id: account.id,
          name: account.name,
          currency: account.currency
        };
        
        // Use Promise.all to transform transactions in parallel
        const transactions = await Promise.all(
          account.transactions.map(transaction => 
            this.transformTransaction(transaction, accountInfo)
          )
        );
        transformedTransactions.push(...transactions);
      }

      if (transformedTransactions.length > 0) {
        await this.storeTransactions(transformedTransactions);
        console.log(`Successfully stored ${transformedTransactions.length} transactions`);
      } else {
        console.log('No transactions found for the period');
      }
    } catch (error) {
      console.error('Error in sync30Days:', error);
      throw error;
    }
  }

  static async runSync() {
    const sync = new SimpleFinSync();
    try {
      await sync.sync30Days();
      console.log('Sync completed successfully');
      process.exit(0);
    } catch (error) {
      console.error('Sync failed:', error);
      process.exit(1);
    }
  }
}

// allow running as standalone script
if (require.main === module) {
  SimpleFinSync.runSync();
}

module.exports = SimpleFinSync;