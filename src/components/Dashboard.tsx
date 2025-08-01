import React from 'react';
import { Users, DollarSign, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { Student, Transaction, Invoice } from '../types';

interface DashboardProps {
  students: Student[];
  transactions: Transaction[];
  invoices: Invoice[];
}

const Dashboard: React.FC<DashboardProps> = ({ students, transactions, invoices }) => {
  const totalStudents = students.length;
  const welfareStudents = students.filter(s => s.isWelfare).length;
  const unpaidFees = students.filter(s => !s.feeStatus).length;
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netIncome = totalIncome - totalExpenses;
  
  const pendingInvoices = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').length;

  const stats = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Monthly Income',
      value: `PKR${totalIncome.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Monthly Expenses',
      value: `PKR${totalExpenses.toLocaleString()}`,
      icon: TrendingDown,
      color: 'bg-red-500',
      change: '-3%'
    },
    {
      title: 'Pending Invoices',
      value: pendingInvoices,
      icon: FileText,
      color: 'bg-amber-500',
      change: '+2'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
        <div className="text-sm text-slate-600">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                  <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Student Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total Students</span>
              <span className="font-semibold">{totalStudents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Welfare Students</span>
              <span className="font-semibold text-blue-600">{welfareStudents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Unpaid Fees</span>
              <span className="font-semibold text-red-600">{unpaidFees}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Fee Collection Rate</span>
              <span className="font-semibold text-green-600">
                {Math.round(((totalStudents - unpaidFees) / totalStudents) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Financial Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total Income</span>
              <span className="font-semibold text-green-600">PKR{totalIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total Expenses</span>
              <span className="font-semibold text-red-600">PKR{totalExpenses.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-800 font-medium">Net Income</span>
                <span className={`font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  PKR{netIncome.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;