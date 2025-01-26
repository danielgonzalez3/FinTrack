const yaml = require('js-yaml');
const fs = require('fs').promises;

async function loadConfig() {
  try {
    const configFile = await fs.readFile('./config.yaml', 'utf8');
    return yaml.load(configFile);
  } catch (error) {
    console.error('Error loading config:', error);
    return null;
  }
}

function categorizeTransaction(description, config) {
  const upperDesc = description.toUpperCase();
  
  for (const [category, categoryConfig] of Object.entries(config.categories)) {
    const matches = categoryConfig.matches.some(match => 
      upperDesc.includes(match.toUpperCase())
    );
    
    if (matches) {
      return category;
    }
  }
  
  return 'uncategorized';
}

async function categorizeTransactions(transactions) {
  const config = await loadConfig();
  if (!config) {
    throw new Error('Failed to load configuration');
  }

  return transactions.map(transaction => ({
    ...transaction,
    category: categorizeTransaction(transaction.description, config)
  }));
}

module.exports = { categorizeTransaction, loadConfig };
