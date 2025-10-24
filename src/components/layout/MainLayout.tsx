import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import ErrorMessage from '../common/ErrorMessage';
import CurrencySelector from '../common/CurrencySelector';
import { useTransactions } from '../../hooks/useTransactions';

const MainLayout: React.FC = () => {
  const { error, clearError } = useTransactions();
  const location = useLocation();

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div>
            <h1>💰 Finance Tracker</h1>
            <p className="app-subtitle">
              Take control of your finances - track income and expenses effortlessly
            </p>
          </div>
          <CurrencySelector />
        </div>
        <nav className="main-nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Dashboard
          </Link>
          <Link
            to="/transactions"
            className={location.pathname.includes('/transactions') ? 'active' : ''}
          >
            Transactions
          </Link>
          <Link
            to="/transactions/new"
            className={location.pathname === '/transactions/new' ? 'active' : ''}
          >
            Add Transaction
          </Link>
        </nav>
      </header>

      <main className="app-main">
        {error && (
          <ErrorMessage
            message={error}
            type="error"
            title="Something went wrong"
            onDismiss={clearError}
          />
        )}
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>Built with React & TypeScript • Data stored locally in your browser</p>
        <small>Your financial data never leaves your device</small>
      </footer>
    </div>
  );
};

export default MainLayout;
