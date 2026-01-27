import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <nav className="home-nav">
        <h2 className="logo">Finance Tracker</h2>
        <div className="nav-links">
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/signup" className="nav-link-primary">
            Get Started
          </Link>
        </div>
      </nav>

      <div className="hero-section">
        <h1 className="hero-title">
          Take Control of Your <span className="gradient-text">Finances</span>
        </h1>
        <p className="hero-description">
          Track your income and expenses effortlessly. Visualize your financial
          health with beautiful charts and insights.
        </p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn-hero-primary">
            Start Free Today
          </Link>
          <Link to="/login" className="btn-hero-secondary">
            Sign In
          </Link>
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose Finance Tracker?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Visual Analytics</h3>
            <p>Beautiful charts and graphs to understand your spending patterns</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Income Tracking</h3>
            <p>Keep track of all your income sources in one place</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Expense Management</h3>
            <p>Monitor and categorize your expenses effortlessly</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Secure & Private</h3>
            <p>Your financial data is encrypted and secure</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
