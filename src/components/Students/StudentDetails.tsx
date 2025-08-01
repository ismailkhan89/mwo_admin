import React from 'react';
import { ArrowLeft, Edit, Phone, MapPin, Calendar, User } from 'lucide-react';
import { Student } from '../../types';

interface StudentDetailsProps {
  student: Student;
  onClose: () => void;
  onEdit: () => void;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ student, onClose, onEdit }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-slate-800">Student Details</h1>
        </div>
        <button
          onClick={onEdit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Student
        </button>
      </div>

      {/* Student Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <p className="text-blue-100 mt-1">Roll Number: {student.rollNumber}</p>
              <p className="text-blue-100">Grade {student.grade} - Section {student.section}</p>
            </div>
            <div className="text-right">
              <div className="flex gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  student.feeStatus 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {student.feeStatus ? 'Fees Paid' : 'Fees Pending'}
                </span>
                {student.isWelfare && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-500 text-white">
                    Welfare
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-600">Date of Birth</label>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    {student.dateOfBirth}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Gender</label>
                  <p className="text-slate-800">{student.gender}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-600">Academic Year</label>
                  <p className="text-slate-800">2024-2025</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Student ID</label>
                  <p className="text-slate-800">{student.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-600">Parent/Guardian</label>
                  <p className="text-slate-800">{student.parentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Contact Number</label>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Phone className="w-4 h-4 text-slate-500" />
                    {student.contactNumber}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Address</label>
                <div className="flex items-start gap-2 text-slate-800">
                  <MapPin className="w-4 h-4 text-slate-500 mt-1 flex-shrink-0" />
                  <p>{student.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Status */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Academic Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-slate-600">Current Grade</label>
                <p className="text-2xl font-bold text-slate-800 mt-1">{student.grade}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-slate-600">Section</label>
                <p className="text-2xl font-bold text-slate-800 mt-1">{student.section}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-slate-600">Student Type</label>
                <p className="text-lg font-semibold text-slate-800 mt-1">
                  {student.isWelfare ? 'Welfare' : 'Regular'}
                </p>
              </div>
            </div>
          </div>

          {/* Fee Status */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Fee Information</h3>
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-600">Current Fee Status</label>
                  <p className={`text-lg font-semibold mt-1 ${
                    student.feeStatus ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {student.feeStatus ? 'All Fees Paid' : 'Fees Pending'}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  student.feeStatus ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <div className={`w-6 h-6 rounded-full ${
                    student.feeStatus ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;