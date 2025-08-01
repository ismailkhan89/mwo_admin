import React from 'react';
import { 
  Home, 
  Users, 
  DollarSign, 
  FileText, 
  Calendar,
  GraduationCap,
  UserCog,
  LogOut
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { ActiveModule } from '../types';
import { useAuth } from '../hooks/useFirestore';
import toast from 'react-hot-toast';

interface SidebarProps {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
  const { user, isAdmin } = useAuth();

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'students', icon: Users, label: 'Students' },
    { id: 'transactions', icon: DollarSign, label: 'Transactions' },
    { id: 'invoices', icon: FileText, label: 'Invoices' },
    { id: 'attendance', icon: Calendar, label: 'Attendance' },
  ];

  // Add Users module only for admins
  if (isAdmin) {
    menuItems.push({ id: 'users', icon: UserCog, label: 'Users' });
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen p-4">
      <div className="flex items-center gap-3 mb-8 p-2">
        <GraduationCap className="w-8 h-8 text-blue-400" />
        <h1 className="text-xl font-bold">MWO Admin</h1>
      </div>

      {/* User Info */}
      <div className="bg-slate-800 rounded-lg p-3 mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white text-sm ${
            isAdmin ? 'bg-purple-500' : 'bg-blue-500'
          }`}>
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.email?.split('@')[0]}
            </p>
            <p className="text-xs text-slate-400">
              {isAdmin ? 'Administrator' : 'User'}
            </p>
          </div>
        </div>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id as ActiveModule)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;