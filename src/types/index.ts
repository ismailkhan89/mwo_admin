export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  grade: string;
  section: string;
  parentName: string;
  contactNumber: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  feeStatus: boolean;
  isWelfare: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: 'income' | 'expense';
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  issueDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface AttendanceData {
  [date: string]: {
    [studentId: string]: boolean;
  };
}

export type ActiveModule = 'dashboard' | 'students' | 'transactions' | 'invoices' | 'attendance' | 'users';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}