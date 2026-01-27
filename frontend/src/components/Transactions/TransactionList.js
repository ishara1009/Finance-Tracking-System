import React, { useState } from 'react';
import { deleteIncome, deleteExpense } from '../../api/api';
import './TransactionList.css';

const TransactionList = ({ incomes, expenses, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(null);

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    setLoading(id);
    try {
      if (type === 'income') {
        await deleteIncome(id);
      } else {
        await deleteExpense(id);
      }
      onRefresh();
    } catch (error) {
      alert('Failed to delete transaction');
    } finally {
      setLoading(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryEmoji = (category, type) => {
    const emojiMap = {
      income: {
        Salary: '💼',
        Freelance: '💻',
        Business: '🏢',
        Investment: '📈',
        Gift: '🎁',
        Other: '💰',
      },
      expense: {
        Food: '🍔',
        Transportation: '🚗',
        Shopping: '🛍️',
        Entertainment: '🎬',
        Bills: '📄',
        Healthcare: '⚕️',
        Education: '📚',
        Other: '💸',
      },
    };
    return emojiMap[type][category] || '💵';
  };

  // Combine and sort transactions
  const allTransactions = [
    ...incomes.map((item) => ({ ...item, type: 'income' })),
    ...expenses.map((item) => ({ ...item, type: 'expense' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const getFilteredTransactions = () => {
    if (activeTab === 'income') {
      return allTransactions.filter((t) => t.type === 'income');
    }
    if (activeTab === 'expense') {
      return allTransactions.filter((t) => t.type === 'expense');
    }
    return allTransactions;
  };

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="transactions-list">
      <div className="transactions-header">
        <h2>Recent Transactions</h2>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`tab ${activeTab === 'income' ? 'active' : ''}`}
            onClick={() => setActiveTab('income')}
          >
            Income
          </button>
          <button
            className={`tab ${activeTab === 'expense' ? 'active' : ''}`}
            onClick={() => setActiveTab('expense')}
          >
            Expense
          </button>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="no-transactions">
          <p>No transactions found</p>
        </div>
      ) : (
        <div className="transactions-grid">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction._id}
              className={`transaction-card ${transaction.type}`}
            >
              <div className="transaction-icon">
                {getCategoryEmoji(transaction.category, transaction.type)}
              </div>
              <div className="transaction-details">
                <h3>{transaction.title}</h3>
                <p className="category">{transaction.category}</p>
                <p className="date">{formatDate(transaction.date)}</p>
                {transaction.description && (
                  <p className="description">{transaction.description}</p>
                )}
              </div>
              <div className="transaction-actions">
                <p className={`amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}$
                  {transaction.amount.toFixed(2)}
                </p>
                <button
                  onClick={() => handleDelete(transaction._id, transaction.type)}
                  className="btn-delete"
                  disabled={loading === transaction._id}
                >
                  {loading === transaction._id ? '...' : '🗑️'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
