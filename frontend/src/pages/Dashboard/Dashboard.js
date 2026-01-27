import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardSummary, getIncomes, getExpenses } from '../../api/api';
import IncomeForm from '../../components/Forms/IncomeForm';
import ExpenseForm from '../../components/Forms/ExpenseForm';
import TransactionList from '../../components/Transactions/TransactionList';
import Chart from '../../components/Charts/Chart';
import './Dashboard.css';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, incomesRes, expensesRes] = await Promise.all([
        getDashboardSummary(),
        getIncomes(),
        getExpenses(),
      ]);
      
      setSummary(summaryRes.data);
      setIncomes(incomesRes.data.incomes);
      setExpenses(expensesRes.data.expenses);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleIncomeAdded = () => {
    setShowIncomeForm(false);
    fetchData();
  };

  const handleExpenseAdded = () => {
    setShowExpenseForm(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2>💰 Finance Tracker</h2>
        </div>
        <div className="nav-user">
          {user?.profile_picture && (
            <img 
              src={user.profile_picture} 
              alt="Profile" 
              className="nav-profile-picture"
            />
          )}
          <span>Welcome, {user?.name}!</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="action-buttons">
            <button
              onClick={() => setShowIncomeForm(true)}
              className="btn-success"
            >
              + Add Income
            </button>
            <button
              onClick={() => setShowExpenseForm(true)}
              className="btn-danger"
            >
              + Add Expense
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="card card-income">
            <div className="card-icon">📈</div>
            <div className="card-content">
              <h3>Total Income</h3>
              <p className="amount">${summary?.summary?.total_income?.toFixed(2) || '0.00'}</p>
              <span className="count">{summary?.summary?.income_count || 0} transactions</span>
            </div>
          </div>

          <div className="card card-expense">
            <div className="card-icon">📉</div>
            <div className="card-content">
              <h3>Total Expense</h3>
              <p className="amount">${summary?.summary?.total_expense?.toFixed(2) || '0.00'}</p>
              <span className="count">{summary?.summary?.expense_count || 0} transactions</span>
            </div>
          </div>

          <div className="card card-balance">
            <div className="card-icon">💵</div>
            <div className="card-content">
              <h3>Balance</h3>
              <p className={`amount ${summary?.summary?.balance >= 0 ? 'positive' : 'negative'}`}>
                ${summary?.summary?.balance?.toFixed(2) || '0.00'}
              </p>
              <span className="count">Net amount</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-section">
          <Chart summary={summary} />
        </div>

        {/* Transactions */}
        <div className="transactions-section">
          <TransactionList
            incomes={incomes}
            expenses={expenses}
            onRefresh={fetchData}
          />
        </div>
      </div>

      {/* Modals */}
      {showIncomeForm && (
        <div className="modal-overlay" onClick={() => setShowIncomeForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <IncomeForm
              onClose={() => setShowIncomeForm(false)}
              onSuccess={handleIncomeAdded}
            />
          </div>
        </div>
      )}

      {showExpenseForm && (
        <div className="modal-overlay" onClick={() => setShowExpenseForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ExpenseForm
              onClose={() => setShowExpenseForm(false)}
              onSuccess={handleExpenseAdded}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
