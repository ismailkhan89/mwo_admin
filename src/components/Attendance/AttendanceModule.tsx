import React, { useState } from 'react';
import { Calendar, Users, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Student, AttendanceData } from '../../types';
import { useAttendance } from '../../hooks/useFirestore';

interface AttendanceModuleProps {
  students: Student[];
}

const AttendanceModule: React.FC<AttendanceModuleProps> = ({ students }) => {
  const { attendance, loading, updateAttendance } = useAttendance();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const filteredStudents = students.filter(student => {
    const matchesGrade = !selectedGrade || student.grade === selectedGrade;
    const matchesSection = !selectedSection || student.section === selectedSection;
    return matchesGrade && matchesSection;
  });
  console.log('selectedDate students:', selectedDate);

  const todayAttendance = attendance[selectedDate] || {};

  const toggleAttendance = (studentId: string) => {
    const newTodayAttendance = {
      ...todayAttendance,
      [studentId]: !todayAttendance[studentId]
    };
    updateAttendance(selectedDate, newTodayAttendance);
  };

  const markAllPresent = () => {
    const newTodayAttendance = {
      ...todayAttendance,
      ...Object.fromEntries(filteredStudents.map(s => [s.id, true]))
    };
    updateAttendance(selectedDate, newTodayAttendance);
  };

  const markAllAbsent = () => {
    const newTodayAttendance = {
      ...todayAttendance,
      ...Object.fromEntries(filteredStudents.map(s => [s.id, false]))
    };
    updateAttendance(selectedDate, newTodayAttendance);
  };

  const presentCount = filteredStudents.filter(s => todayAttendance[s.id]).length;
  const absentCount = filteredStudents.length - presentCount;
  const attendanceRate = filteredStudents.length > 0 ? Math.round((presentCount / filteredStudents.length) * 100) : 0;

  const uniqueGrades = Array.from(new Set(students.map(s => s.grade))).sort();
  const uniqueSections = Array.from(new Set(students.map(s => s.section))).sort();

  // Date navigation
  const changeDate = (days: number) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + days);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading attendance...</p>
        </div>
      </div>
    );
  }
console.log('selectedDate:', selectedDate);
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Attendance Management</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => changeDate(1)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Students</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{filteredStudents.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Present</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{presentCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Absent</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{absentCount}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <X className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Attendance Rate</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{attendanceRate}%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Grades</option>
              {uniqueGrades.map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>

            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Sections</option>
              {uniqueSections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={markAllPresent}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
            >
              <Check className="w-4 h-4" />
              Mark All Present
            </button>
            <button
              onClick={markAllAbsent}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
            >
              <X className="w-4 h-4" />
              Mark All Absent
            </button>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">
            Attendance for {selectedDate}
            {/* {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} */}
          </h3>
        </div>
        
        <div className="divide-y divide-slate-100">
          {filteredStudents.map((student) => {
            const isPresent = todayAttendance[student.id];
            
            return (
              <div key={student.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white ${
                        student.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'
                      }`}>
                        {student.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{student.name}</h4>
                      <p className="text-sm text-slate-600">
                        Roll: {student.rollNumber} | Grade {student.grade}-{student.section}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAttendance(student.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        isPresent
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {isPresent ? (
                        <>
                          <Check className="w-4 h-4" />
                          Present
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          Absent
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredStudents.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No students found for the selected criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceModule;