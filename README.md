
# FinTrack

A robust transaction management application built with Node.js, Express, and MySQL.

## Features

- RESTful API for transaction management
- Complete CRUD operations for transactions
- Automated database backup system
- Integration with external financial data sources
- Concurrent development setup for client and server

## Requirements

- Node.js >= 18.19.0
- MySQL/Docker
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/danielgonzalez3/FinTrack.git
cd FinTrack
```

2. Install dependencies:
```bash
npm install
cd client && npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
SIMPLEFIN_URL='https://RetrieveThisFromSimpleFIn:FOoBarbazThisisHowItSHouldbeFormatted@beta-bridge.simplefin.org/simplefin'
```

4. Initialize database:
Use the provided SQL schema to create the transactions table.

```
CREATE TABLE `transactions` (
  `transaction_id` varchar(100) NOT NULL,
  `account_id` varchar(100) DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `currency` varchar(10) DEFAULT NULL,
  `posted` int unsigned DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT '0.00',
  `description` varchar(255) DEFAULT NULL,
  `payee` varchar(255) DEFAULT NULL,
  `memo` varchar(255) DEFAULT NULL,
  `transacted_at` int unsigned DEFAULT NULL,
  PRIMARY KEY (`transaction_id`)
)
```


## API Endpoints

- POST `/transactions` - Create a new transaction
- GET `/transactions` - Retrieve all transactions
- GET `/transactions/:id` - Retrieve a specific transaction
- PUT `/transactions/:id` - Update a transaction
- DELETE `/transactions/:id` - Delete a transaction

## Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run dev:server` - Start server with nodemon
- `npm run dev:client` - Start client development server
- `npm run update-db` - Sync database with external financial data
- `npm run backup-db` - Create database backup

## License

[MIT License](LICENSE)