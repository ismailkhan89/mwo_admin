import React, { useState } from 'react';
import { ArrowLeft, Save, X, User, Mail, Phone, Shield } from 'lucide-react';
import { User as UserType } from '../../types';

interface UserFormProps {
  user?: UserType | null;
  onSubmit: (user: Omit<UserType, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<UserType, 'id' | 'createdAt' | 'updatedAt'>>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    isAdmin: user?.isAdmin || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof Omit<UserType, 'id' | 'createdAt' | 'updatedAt'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-slate-800">
          {user ? 'Edit User' : 'Add New User'}
        </h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">User Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full pl-11 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full pl-11 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full pl-11 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      checked={!formData.isAdmin}
                      onChange={() => handleChange('isAdmin', false)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span className="text-sm text-slate-700">Regular User</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      checked={formData.isAdmin}
                      onChange={() => handleChange('isAdmin', true)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300"
                    />
                    <span className="text-sm text-slate-700 flex items-center gap-1">
                      <Shield className="w-4 h-4 text-purple-600" />
                      Administrator
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Role Information */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-2">Role Permissions</h4>
            <div className="text-sm text-slate-600">
              {formData.isAdmin ? (
                <ul className="space-y-1">
                  <li>• Full access to all modules</li>
                  <li>• Can manage users and permissions</li>
                  <li>• Can view all data across the system</li>
                  <li>• Can create, edit, and delete records</li>
                </ul>
              ) : (
                <ul className="space-y-1">
                  <li>• Limited access to assigned modules</li>
                  <li>• Can only view and edit own data</li>
                  <li>• Cannot manage other users</li>
                  <li>• Read-only access to most features</li>
                </ul>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              {user ? 'Update User' : 'Add User'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;