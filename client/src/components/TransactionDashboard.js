import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';
import './TransactionDashboard.css';

const API_BASE_URL = 'http://127.0.0.1:5000';

const fetchTransactions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/transactions`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please check your internet connection or try again later.');
    }
    throw error;
  }
};

const TransactionDashboard = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-alert">
        <AlertCircle style={{ width: '20px', height: '20px', marginRight: '8px' }} />
        <div className="error-content">
          <h3>Error Loading Transactions</h3>
          <div className="error-message">
            {error.message}
            <button onClick={() => refetch()} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Prepare data for chart and table
  const transactions = data?.data || [];

  const spendingByDay = transactions.reduce((acc, transaction) => {
    const date = dayjs(transaction.posted * 1000).format('YYYY-MM-DD');
    const amount = parseFloat(transaction.amount);
    acc[date] = (acc[date] || 0) + amount;
    return acc;
  }, {});

  const chartData = Object.entries(spendingByDay)
    .map(([date, amount]) => ({
      date,
      amount: Math.abs(amount)
    }))
    .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());

  return (
    <div className="dashboard">
      <h1>Transaction Dashboard</h1>

      {/* Chart Section */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => dayjs(date).format('MM/DD')}
            />
            <YAxis 
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, 'Spending Amount']}
              labelFormatter={(date) => dayjs(date).format('MMMM D, YYYY')}
            />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" name="Spending Amount" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payee Summary Table */}
      <div className="table-container">
        <h2>Spending Summary by Payee</h2>
        <table>
          <thead>
            <tr>
              <th>Payee</th>
              <th>Total Spent</th>
              <th>Number of Transactions</th>
              <th>Average Transaction</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(
              transactions.reduce((acc, transaction) => {
                const payee = transaction.description;
                if (!acc[payee]) {
                  acc[payee] = {
                    total: 0,
                    count: 0,
                    amounts: []
                  };
                }
                const amount = Math.abs(parseFloat(transaction.amount));
                acc[payee].total += amount;
                acc[payee].count += 1;
                acc[payee].amounts.push(amount);
                return acc;
              }, {})
            )
              .sort((a, b) => b[1].total - a[1].total) // Sort by total spent
              .map(([payee, stats]) => (
                <tr key={payee}>
                  <td>{payee}</td>
                  <td className="amount-column">
                    ${stats.total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                  <td className="text-center">{stats.count}</td>
                  <td className="amount-column">
                    ${(stats.total / stats.count).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionDashboard;