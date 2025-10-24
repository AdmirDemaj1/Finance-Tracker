import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CurrencyProvider } from './contexts/CurrencyContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import TransactionList from './pages/TransactionList';
import TransactionForm from './pages/TransactionForm';
import './App.css';

const App: React.FC = () => {
  return (
    <CurrencyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="transactions">
              <Route index element={<TransactionList />} />
              <Route path="new" element={<TransactionForm />} />
              <Route path=":id/edit" element={<TransactionForm />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CurrencyProvider>
  );
};

export default App;
