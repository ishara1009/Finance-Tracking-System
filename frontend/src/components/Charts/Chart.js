import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './Chart.css';

const Chart = ({ summary }) => {
  const COLORS = {
    income: ['#11998e', '#38ef7d', '#20bf6b', '#26de81', '#2bcbba'],
    expense: ['#eb3349', '#f45c43', '#fc5c65', '#fd79a8', '#fdcb6e'],
  };

  // Prepare data for category breakdown
  const incomeData = summary?.category_breakdown?.income
    ? Object.entries(summary.category_breakdown.income).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }))
    : [];

  const expenseData = summary?.category_breakdown?.expense
    ? Object.entries(summary.category_breakdown.expense).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }))
    : [];

  // Prepare comparison data
  const comparisonData = [
    {
      name: 'Total',
      Income: summary?.summary?.total_income || 0,
      Expense: summary?.summary?.total_expense || 0,
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].name}`}</p>
          <p className="value">{`$${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="charts-container">
      <h2 className="charts-title">Financial Overview</h2>

      {/* Income vs Expense Bar Chart */}
      <div className="chart-section">
        <h3>Income vs Expense</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Income" fill="#11998e" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Expense" fill="#eb3349" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Charts */}
      <div className="pie-charts">
        {/* Income Breakdown */}
        {incomeData.length > 0 && (
          <div className="chart-section">
            <h3>Income by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incomeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS.income[index % COLORS.income.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Expense Breakdown */}
        {expenseData.length > 0 && (
          <div className="chart-section">
            <h3>Expense by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS.expense[index % COLORS.expense.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {incomeData.length === 0 && expenseData.length === 0 && (
        <div className="no-data">
          <p>No data available yet. Start by adding income or expenses!</p>
        </div>
      )}
    </div>
  );
};

export default Chart;
