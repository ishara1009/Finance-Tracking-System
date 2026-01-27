import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './Chart.css';

const Chart = ({ summary, incomes = [], expenses = [] }) => {
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

  // Prepare trend data (last 6 months or available data)
  const prepareTrendData = () => {
    const allTransactions = [
      ...incomes.map(i => ({ ...i, type: 'income' })),
      ...expenses.map(e => ({ ...e, type: 'expense' }))
    ];

    // Group by month
    const monthlyData = {};
    
    allTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { month: monthYear, Income: 0, Expense: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthYear].Income += transaction.amount;
      } else {
        monthlyData[monthYear].Expense += transaction.amount;
      }
    });

    return Object.values(monthlyData)
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .slice(-6); // Last 6 months
  };

  const trendData = prepareTrendData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          {label && <p className="tooltip-label">{label}</p>}
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-value" style={{ color: entry.color }}>
              {`${entry.name}: Rs. ${entry.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${payload[0].name}`}</p>
          <p className="tooltip-value">{`Rs. ${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show label if less than 5%
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="14"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="charts-container">
      <h2 className="charts-title">Financial Analytics</h2>

      {/* Monthly Trend - Area Chart */}
      {trendData.length > 0 && (
        <div className="chart-section chart-primary">
          <div className="chart-header">
            <h3>Monthly Trend</h3>
            <p className="chart-subtitle">Track your income and expenses over time</p>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#11998e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#11998e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eb3349" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#eb3349" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#999"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#999"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `Rs. ${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Area 
                type="monotone" 
                dataKey="Income" 
                stroke="#11998e" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorIncome)" 
              />
              <Area 
                type="monotone" 
                dataKey="Expense" 
                stroke="#eb3349" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorExpense)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Income vs Expense Bar Chart */}
      <div className="chart-section chart-secondary">
        <div className="chart-header">
          <h3>Income vs Expense Comparison</h3>
          <p className="chart-subtitle">Overall financial summary</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#999" tick={{ fontSize: 12 }} />
            <YAxis stroke="#999" tick={{ fontSize: 12 }} tickFormatter={(value) => `Rs. ${value}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" />
            <Bar 
              dataKey="Income" 
              fill="#11998e" 
              radius={[10, 10, 0, 0]}
              maxBarSize={100}
            />
            <Bar 
              dataKey="Expense" 
              fill="#eb3349" 
              radius={[10, 10, 0, 0]}
              maxBarSize={100}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Charts */}
      <div className="pie-charts-grid">
        {/* Income Breakdown */}
        {incomeData.length > 0 && (
          <div className="chart-section chart-card">
            <div className="chart-header">
              <h3>Income Distribution</h3>
              <p className="chart-subtitle">Breakdown by category</p>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={incomeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={110}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {incomeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS.income[index % COLORS.income.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  formatter={(value, entry) => `${value}: Rs. ${entry.payload.value.toFixed(2)}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Expense Breakdown */}
        {expenseData.length > 0 && (
          <div className="chart-section chart-card">
            <div className="chart-header">
              <h3>Expense Distribution</h3>
              <p className="chart-subtitle">Breakdown by category</p>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={110}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {expenseData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS.expense[index % COLORS.expense.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  formatter={(value, entry) => `${value}: Rs. ${entry.payload.value.toFixed(2)}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {incomeData.length === 0 && expenseData.length === 0 && (
        <div className="no-data">
          <div className="no-data-icon">📊</div>
          <h3>No Data Available</h3>
          <p>Start by adding income or expenses to see your financial analytics!</p>
        </div>
      )}
    </div>
  );
};

export default Chart;
