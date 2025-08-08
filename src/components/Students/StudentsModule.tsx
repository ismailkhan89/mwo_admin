import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { Student } from '../../types';
import { useStudents, useUsers } from '../../hooks/useFirestore';
import StudentForm from './StudentForm';
import StudentDetails from './StudentDetails';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../../../assets/logo.png'; // adjust the path to your logo
const StudentsModule: React.FC = () => {
  const { students, loading, addStudent, updateStudent, deleteStudent } = useStudents();
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterWelfare, setFilterWelfare] = useState('');

  const [filterCreatedBy, setFilterCreatedBy] = useState('');

  const { users } = useUsers();
  console.log('useUsers hook called useUsers', users);
  const userMap = Object.fromEntries(users.map(user => [user.id, user.displayName]));
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.includes(searchTerm) ||
                         student.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = !filterGrade || student.grade === filterGrade;
    const matchesWelfare = !filterWelfare || 
                          (filterWelfare === 'welfare' && student.isWelfare) ||
                          (filterWelfare === 'regular' && !student.isWelfare);
     const matchesCreatedBy = !filterCreatedBy || student.createdBy === filterCreatedBy;
  return matchesSearch && matchesGrade && matchesWelfare && matchesCreatedBy;
  });

  const handleAddStudent = (studentData: Omit<Student, 'id'>) => {
    addStudent(studentData);
    setShowForm(false);
  };

  const handleEditStudent = (studentData: Omit<Student, 'id'>) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, studentData);
      setEditingStudent(null);
      setShowForm(false);
    }
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      deleteStudent(id);
    }
  };
  const getImageBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d')!.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
  });
};

const exportToPDF = async () => {
  const doc = new jsPDF();

  const logoBase64 = await getImageBase64(logo);

  doc.addImage(logoBase64, 'PNG', 10, 10, 25, 25);

  // ✅ Convert UID to name
  const creator = users.find((u) => u.id === filterCreatedBy);
  const createdByText = `Created By: ${creator?.displayName || 'All'}`;

  doc.setFontSize(10);
  const textWidth = doc.getTextWidth(createdByText);
  doc.text(createdByText, doc.internal.pageSize.getWidth() - textWidth - 10, 15);

  doc.setFontSize(16);
  doc.text('Filtered Students Report', 14, 45);

  autoTable(doc, {
    startY: 50,
    head: [['Name', 'Roll No.', 'Grade/Section', 'Parent', 'Contact', 'Status', 'Welfare']],
    body: filteredStudents.map((s) => [
      s.name,
      s.rollNumber,
      `${s.grade}-${s.section}`,
      s.parentName,
      s.contactNumber,
      s.feeStatus ? 'Paid' : 'Pending',
      s.isWelfare ? 'Yes' : 'No'
    ]),
    styles: {
      fontSize: 10,
    },
  });

  doc.save('students-report.pdf');
};


  const uniqueGrades = Array.from(new Set(students.map(s => s.grade))).sort();
  const uniqueCreators = Array.from(new Set(students.map(s => s.createdBy)));

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading students...</p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <StudentForm
        student={editingStudent}
        onSubmit={editingStudent ? handleEditStudent : handleAddStudent}
        onCancel={() => {
          setShowForm(false);
          setEditingStudent(null);
        }}
      />
    );
  }

  if (showDetails && selectedStudent) {
    return (
      <StudentDetails
        student={selectedStudent}
        onClose={() => {
          setShowDetails(false);
          setSelectedStudent(null);
        }}
        onEdit={() => {
          setEditingStudent(selectedStudent);
          setShowForm(true);
          setShowDetails(false);
        }}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Students Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
<button
  onClick={exportToPDF}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
>
  Export PDF
</button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Grades</option>
            {uniqueGrades.map(grade => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </select>

          <select
            value={filterWelfare}
            onChange={(e) => setFilterWelfare(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Students</option>
            <option value="welfare">Welfare Students</option>
            <option value="regular">Regular Students</option>
          </select>

          <select
            value={filterCreatedBy}
            onChange={(e) => setFilterCreatedBy(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Creators</option>
            {uniqueCreators.map(uid => (
                <option key={uid} value={uid}>{userMap[uid] || uid}</option>

            ))}
          </select>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Filter className="w-4 h-4" />
            {filteredStudents.length} of {students.length} students
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700">Student</th>
                <th className="text-left p-4 font-semibold text-slate-700">Roll No.</th>
                <th className="text-left p-4 font-semibold text-slate-700">Grade/Section</th>
                <th className="text-left p-4 font-semibold text-slate-700">Parent</th>
                <th className="text-left p-4 font-semibold text-slate-700">Contact</th>
                <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                <th className="text-left p-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-slate-800">{student.name}</div>
                      <div className="text-sm text-slate-600">{student.gender}</div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-700">{student.rollNumber}</td>
                  <td className="p-4 text-slate-700">{student.grade}-{student.section}</td>
                  <td className="p-4 text-slate-700">{student.parentName}</td>
                  <td className="p-4 text-slate-700">{student.contactNumber}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        student.feeStatus 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.feeStatus ? 'Fees Paid' : 'Fees Pending'}
                      </span>
                      {student.isWelfare && (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Welfare
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowDetails(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingStudent(student);
                          setShowForm(true);
                        }}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStudents.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No students found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsModule;