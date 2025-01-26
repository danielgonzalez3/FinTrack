require('dotenv').config();
const cors = require('cors');
const express = require('express');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
const port = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', transactionRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});