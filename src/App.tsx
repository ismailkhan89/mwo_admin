import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth, useStudents, useTransactions, useInvoices } from './hooks/useFirestore';
import LoginScreen from './components/Auth/LoginScreen';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentsModule from './components/Students/StudentsModule';
import TransactionsModule from './components/Transactions/TransactionsModule';
import InvoicesModule from './components/Invoices/InvoicesModule';
import AttendanceModule from './components/Attendance/AttendanceModule';
import UsersModule from './components/Users/UsersModule';
import { ActiveModule } from './types';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { students } = useStudents();
  const { transactions } = useTransactions();
  const { invoices } = useInvoices();
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <Dashboard
            students={students}
            transactions={transactions}
            invoices={invoices}
          />
        );
      case 'students':
        return (
          <StudentsModule />
        );
      case 'transactions':
        return (
          <TransactionsModule />
        );
      case 'invoices':
        return (
          <InvoicesModule />
        );
      case 'attendance':
        return (
          <AttendanceModule
            students={students}
          />
        );
      case 'users':
        return (
          <UsersModule />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <main className="flex-1 overflow-auto">
        {renderActiveModule()}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;