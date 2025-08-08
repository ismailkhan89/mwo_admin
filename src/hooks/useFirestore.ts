import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { 
  studentsService, 
  transactionsService, 
  invoicesService, 
  attendanceService,
  authService,
  usersService,
  addCreatedAtToAllStudents
} from '../services/firestore';
import { Student, Transaction, Invoice, AttendanceData, User } from '../types';
import toast from 'react-hot-toast';

// Custom hook for authentication
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      console.log('Auth state changed:', user);
      if (user) {
        try {
          const adminStatus = await authService.isAdmin();
                console.log('Auth state changed:', adminStatus);
                
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, isAdmin, loading };
};

// Custom hook for students data
export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: isAdmin } = useAuth();
  console.log('useStudents hook called', user, isAdmin);
  useEffect(() => {
    
    
      addCreatedAtToAllStudents().catch((err) => {
        console.error('Failed to update students:', err);
      });
    }, []);


  useEffect(() => {
    if(user && isAdmin){
    console.log('useStudents hook called',user);
const unsubscribe = studentsService.subscribeToStudents(
    user.uid,
    isAdmin,
    (studentsData) => {
      console.log('Fetched students:', studentsData);
      setStudents(studentsData);
      setLoading(false);
    }
  );

  return () => unsubscribe();
    }
  }, [user, isAdmin]);

  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    try {
      await studentsService.addStudent(studentData);
      toast.success('Student added successfully!');
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Failed to add student');
      throw error;
    }
  };

  const updateStudent = async (id: string, studentData: Partial<Student>) => {
    try {
      await studentsService.updateStudent(id, studentData);
      toast.success('Student updated successfully!');
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Failed to update student');
      throw error;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await studentsService.deleteStudent(id);
      toast.success('Student deleted successfully!');
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
      throw error;
    }
  };

  return {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent
  };
};

// Custom hook for transactions data
export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = transactionsService.subscribeToTransactions((transactionsData) => {
      setTransactions(transactionsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await transactionsService.addTransaction(transactionData);
      toast.success('Transaction added successfully!');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
      throw error;
    }
  };

  const updateTransaction = async (id: string, transactionData: Partial<Transaction>) => {
    try {
      await transactionsService.updateTransaction(id, transactionData);
      toast.success('Transaction updated successfully!');
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionsService.deleteTransaction(id);
      toast.success('Transaction deleted successfully!');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
      throw error;
    }
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
};

// Custom hook for invoices data
export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = invoicesService.subscribeToInvoices((invoicesData) => {
      setInvoices(invoicesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addInvoice = async (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await invoicesService.addInvoice(invoiceData);
      toast.success('Invoice created successfully!');
    } catch (error) {
      console.error('Error adding invoice:', error);
      toast.error('Failed to create invoice');
      throw error;
    }
  };

  const updateInvoice = async (id: string, invoiceData: Partial<Invoice>) => {
    try {
      await invoicesService.updateInvoice(id, invoiceData);
      toast.success('Invoice updated successfully!');
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice');
      throw error;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      await invoicesService.deleteInvoice(id);
      toast.success('Invoice deleted successfully!');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
      throw error;
    }
  };

  return {
    invoices,
    loading,
    error,
    addInvoice,
    updateInvoice,
    deleteInvoice
  };
};

// Custom hook for attendance data
export const useAttendance = () => {
  const [attendance, setAttendance] = useState<AttendanceData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = attendanceService.subscribeToAttendance((attendanceData) => {
      setAttendance(attendanceData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateAttendance = async (date: string, attendanceData: { [studentId: string]: boolean }) => {
    try {
      await attendanceService.updateAttendance(date, attendanceData);
      toast.success('Attendance updated successfully!');
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Failed to update attendance');
      throw error;
    }
  };

  return {
    attendance,
    loading,
    error,
    updateAttendance
  };
};

// Custom hook for users data
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const { user, loading: isAdmin } = useAuth();
  useEffect(() => {
    // const unsubscribe = usersService.subscribeToUsers((usersData) => {
    //   setUsers(usersData);
    //   setLoading(false);
    // });
    if(user && isAdmin) {
   const unsubscribe = usersService.subscribeToUsers(user.uid, isAdmin, (users) => {
      setUsers(users);
      setLoading(false);
    });

    return () => unsubscribe();
  }
  }, [user, isAdmin]);

  const addUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await usersService.addUser(userData);
      toast.success('User added successfully!');
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
      throw error;
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      await usersService.updateUser(id, userData);
      toast.success('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await usersService.deleteUser(id);
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
      throw error;
    }
  };

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser
  };
};