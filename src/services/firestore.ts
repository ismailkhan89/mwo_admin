import { 
  collection, 
  doc, 
  setDoc,
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Student, Transaction, Invoice, AttendanceData, User } from '../types';

// ========== Students Service ==========
export const studentsService = {
  // Get all students (admin) or only user's students
  async getStudents(userId: string, isAdmin: boolean): Promise<Student[]> {
    try {
      const studentsRef = collection(db, 'students');
console.log('Fetching students for userId:', userId, 'isAdmin:', isAdmin);
      const q = isAdmin
        ? query(studentsRef, orderBy('createdAt', 'desc'))
        : query(
            studentsRef,
            // where('createdBy', '==', userId),
            orderBy('createdAt', 'desc')
          );

          console.log('Fetching students with query:', q);

      const querySnapshot = await getDocs(q);
      
      console.log('Fetched students:', querySnapshot.docs.length);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateOfBirth: doc.data().dateOfBirth || '',
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Student[];
    } catch (error) {
      console.error('Error fetching students:', error);
      throw new Error('Failed to fetch students');
    }
  },

  // Add new student
  async addStudent(studentData: Omit<Student, 'id'>): Promise<string> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const docRef = await addDoc(collection(db, 'students'), {
        ...studentData,
        createdBy: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  },

  // Update student
  async updateStudent(id: string, studentData: Partial<Student>): Promise<void> {
    try {
      const studentRef = doc(db, 'students', id);
      await updateDoc(studentRef, {
        ...studentData,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  // Delete student
  async deleteStudent(id: string): Promise<void> {
    try {
      const studentRef = doc(db, 'students', id);
      await deleteDoc(studentRef);
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },

  // Subscribe to students changes
subscribeToStudents(
  userId: string,
  isAdmin: boolean,
  callback: (students: Student[]) => void
) {
  const studentsRef = collection(db, 'students');
console.log('Subscribing to students for userId:', userId, 'isAdmin:', isAdmin);
  // Conditionally build the query
  const q = query(studentsRef, orderBy('createdAt', 'desc'))
  // const q = isAdmin
    // ? query(studentsRef, orderBy('createdAt', 'desc'))
    // : query(
    //     studentsRef,
    //     // where('createdBy', '==', userId),
    //     orderBy('createdAt', 'desc')
    //   );
console.log('Subscribing to students for userId:', userId, 'isAdmin:', isAdmin);
  return onSnapshot(q, (querySnapshot) => {
    console.log('querySnapshot.docs', querySnapshot.docs);
    const students = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // dateOfBirth: doc.data().dateOfBirth || '',
      // createdAt: doc.data().createdAt?.toDate() || new Date(),
      // updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Student[];

    callback(students);
  });
}

};
export const addCreatedAtToAllStudents = async () => {
  const studentsRef = collection(db, 'students');
  const snapshot = await getDocs(studentsRef);

  const updates = [];

  for (const studentDoc of snapshot.docs) {
    const data = studentDoc.data();

    if (!data.createdAt) {
      const studentRef = doc(db, 'students', studentDoc.id);

      // Update with current timestamp
      const updatePromise = updateDoc(studentRef, {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(), // optional
      });

      updates.push(updatePromise);
    }
  }

  await Promise.all(updates);
  console.log('Updated all students with createdAt.');
};

// ========== Transactions Service ==========
export const transactionsService = {
  // Get all transactions
  async getTransactions(): Promise<Transaction[]> {
    try {
      const transactionsRef = collection(db, 'transactions');
      const q = query(transactionsRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Transaction[];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  // Add new transaction
  async addTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const docRef = await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        date: Timestamp.fromDate(transactionData.date),
        userId: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  // Update transaction
  async updateTransaction(id: string, transactionData: Partial<Transaction>): Promise<void> {
    try {
      const transactionRef = doc(db, 'transactions', id);
      const updateData: any = {
        ...transactionData,
        updatedAt: Timestamp.now()
      };
      
      if (transactionData.date) {
        updateData.date = Timestamp.fromDate(transactionData.date);
      }
      
      await updateDoc(transactionRef, updateData);
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  // Delete transaction
  async deleteTransaction(id: string): Promise<void> {
    try {
      const transactionRef = doc(db, 'transactions', id);
      await deleteDoc(transactionRef);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  // Subscribe to transactions changes
  subscribeToTransactions(callback: (transactions: Transaction[]) => void) {
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, orderBy('date', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const transactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Transaction[];
      
      callback(transactions);
    });
  }
};

// ========== Invoices Service ==========
export const invoicesService = {
  // Get all invoices
  async getInvoices(): Promise<Invoice[]> {
    try {
      const invoicesRef = collection(db, 'invoices');
      const q = query(invoicesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        issueDate: doc.data().issueDate?.toDate() || new Date(),
        dueDate: doc.data().dueDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Invoice[];
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  // Add new invoice
  async addInvoice(invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const docRef = await addDoc(collection(db, 'invoices'), {
        ...invoiceData,
        issueDate: Timestamp.fromDate(invoiceData.issueDate),
        dueDate: Timestamp.fromDate(invoiceData.dueDate),
        userId: user.uid,
        transactionId: `txn_${Date.now()}`, // Generate transaction ID
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding invoice:', error);
      throw error;
    }
  },

  // Update invoice
  async updateInvoice(id: string, invoiceData: Partial<Invoice>): Promise<void> {
    try {
      const invoiceRef = doc(db, 'invoices', id);
      const updateData: any = {
        ...invoiceData,
        updatedAt: Timestamp.now()
      };
      
      if (invoiceData.issueDate) {
        updateData.issueDate = Timestamp.fromDate(invoiceData.issueDate);
      }
      if (invoiceData.dueDate) {
        updateData.dueDate = Timestamp.fromDate(invoiceData.dueDate);
      }
      
      await updateDoc(invoiceRef, updateData);
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  // Delete invoice
  async deleteInvoice(id: string): Promise<void> {
    try {
      const invoiceRef = doc(db, 'invoices', id);
      await deleteDoc(invoiceRef);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  },

  // Subscribe to invoices changes
  subscribeToInvoices(callback: (invoices: Invoice[]) => void) {
    const invoicesRef = collection(db, 'invoices');
    const q = query(invoicesRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const invoices = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        issueDate: doc.data().issueDate?.toDate() || new Date(),
        dueDate: doc.data().dueDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Invoice[];
      
      callback(invoices);
    });
  }
};

// ========== Attendance Service ==========
export const attendanceService = {
  // Get attendance for a specific date
  async getAttendanceByDate(date: string): Promise<{ [studentId: string]: boolean }> {
    try {
      const attendanceRef = doc(db, 'attendance', date);
      const docSnap = await getDocs(query(collection(db, 'attendance'), where('__name__', '==', date)));
      
      if (docSnap.empty) {
        return {};
      }
      
      const attendanceDoc = docSnap.docs[0];
      const data = attendanceDoc.data();
      
      // Remove metadata fields and return only student attendance
      const { markedBy, markedAt, ...studentAttendance } = data;
      return studentAttendance;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return {};
    }
  },

  // Get all attendance data
  async getAllAttendance(): Promise<AttendanceData> {
    try {
      const attendanceRef = collection(db, 'attendance');
      const querySnapshot = await getDocs(attendanceRef);
      
      const attendanceData: AttendanceData = {};
      
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        const { markedBy, markedAt, ...studentAttendance } = data;
        attendanceData[doc.id] = studentAttendance;
      });
      
      return attendanceData;
    } catch (error) {
      console.error('Error fetching all attendance:', error);
      return {};
    }
  },

  // Update attendance for a specific date
  async updateAttendance(date: string, attendanceData: { [studentId: string]: boolean }): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const attendanceRef = doc(db, 'attendance', date);
      await updateDoc(attendanceRef, {
        ...attendanceData,
        markedBy: user.uid,
        markedAt: Timestamp.now()
      });
    } catch (error) {
      // If document doesn't exist, create it
      if (error.code === 'not-found') {
        await this.createAttendance(date, attendanceData);
      } else {
        console.error('Error updating attendance:', error);
        throw error;
      }
    }
  },

  // Create attendance for a specific date
  async createAttendance(date: string, attendanceData: { [studentId: string]: boolean }): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const attendanceRef = doc(db, 'attendance', date);
      await updateDoc(attendanceRef, {
        ...attendanceData,
        markedBy: user.uid,
        markedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error creating attendance:', error);
      throw error;
    }
  },

  // Subscribe to attendance changes
  subscribeToAttendance(callback: (attendance: AttendanceData) => void) {
    const attendanceRef = collection(db, 'attendance');
    
    return onSnapshot(attendanceRef, (querySnapshot) => {
      const attendanceData: AttendanceData = {};
      
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        const { markedBy, markedAt, ...studentAttendance } = data;
        attendanceData[doc.id] = studentAttendance;
      });
      
      callback(attendanceData);
    });
  }
};

// ========== Auth Service ==========
export const authService = {
  // Check if current user is admin
  async isAdmin(): Promise<boolean> {
    try {
      const user = auth.currentUser;
      if (!user) return false;

      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', user.uid)));
      
      if (userDoc.empty) return false;
      
      const userData = userDoc.docs[0].data();
      return userData.isAdmin === true;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
};

// ========== Users Service ==========
export const usersService = {
  // Get all users
  async getUsers(): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as User[];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Add new user
  async addUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(id: string, userData: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', id);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Subscribe to users changes
  // subscribeToUsers(callback: (users: User[]) => void) {
  //   const usersRef = collection(db, 'users');
  //   const q = query(usersRef, orderBy('createdAt', 'desc'));
    
  //   return onSnapshot(q, (querySnapshot) => {
  //     const users = querySnapshot.docs.map(doc => ({
  //       id: doc.id,
  //       ...doc.data(),
  //       createdAt: doc.data().createdAt?.toDate() || new Date(),
  //       // updatedAt: doc.data().updatedAt?.toDate() || new Date()
  //     })) as User[];
      
  //     callback(users);
  //   });
  // }

subscribeToUsers(
  currentUserId: string,
  isAdmin: boolean,
  callback: (users: User[]) => void
) {
  const usersRef = collection(db, 'users');
console.log('Subscribing to users for currentUserId:', currentUserId, 'isAdmin:', isAdmin);
const q =  query(usersRef)
  // ? query(usersRef) // no orderBy
  // : query(usersRef, where('__name__', '==', currentUserId));

  return onSnapshot(q, (querySnapshot) => {
    console.log("Query snapshot size:", querySnapshot.size);
console.log("Docs received:", querySnapshot.docs.map(doc => doc.id));
    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as User[];

    callback(users);
  });
}


};