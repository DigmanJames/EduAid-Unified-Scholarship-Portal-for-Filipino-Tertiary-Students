
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Search, Heart, FileText, Bell, 
  Settings, LogOut, Menu, X, GraduationCap
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useScholarships } from '../context/ScholarshipContext'; // Import Scholarship Context
import { Sun, Moon } from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const { notifications } = useUser();
  const { savedIds } = useScholarships(); // Get saved scholarships list

  // Redirect if not logged in
  React.useEffect(() => {
    if (!currentUser) {
       navigate('/login');
    }
  }, [currentUser, navigate]);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Find Scholarships', path: '/dashboard/scholarships', icon: <Search size={20} /> },
    { label: 'Saved Scholarships', path: '/dashboard/saved', icon: <Heart size={20} /> },
    { label: 'My Applications', path: '/dashboard/applications', icon: <FileText size={20} /> },
    { label: 'Notifications', path: '/dashboard/notifications', icon: <Bell size={20} /> },
    { label: 'Profile Settings', path: '/dashboard/profile', icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const savedCount = savedIds.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex relative">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-72 z-50
        bg-white/80 dark:bg-navy-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-white/5
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex flex-col h-full">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-accent-blue/10 dark:bg-accent-blue/20 rounded-lg border border-accent-blue/30">
              <GraduationCap className="w-6 h-6 text-accent-blue" />
            </div>
            <span className="text-xl font-bold font-heading text-slate-900 dark:text-white">
              EduAid
            </span>
            <button className="md:hidden ml-auto" onClick={() => setIsSidebarOpen(false)}>
              <X className="text-slate-500" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-grow space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative
                    ${isActive 
                      ? 'bg-accent-blue/10 text-accent-blue font-semibold border border-accent-blue/20' 
                      : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  
                  {/* Notification Count Badge */}
                  {item.label === 'Notifications' && unreadCount > 0 && (
                    <span className="absolute right-4 bg-red-500 text-white text-[10px] min-w-[1.25rem] h-5 rounded-full flex items-center justify-center font-bold px-1 shadow-sm">
                        {unreadCount}
                    </span>
                  )}

                  {/* Saved Count Badge */}
                  {item.label === 'Saved Scholarships' && savedCount > 0 && (
                    <span className="absolute right-4 bg-red-500 text-white text-[10px] min-w-[1.25rem] h-5 rounded-full flex items-center justify-center font-bold px-1 shadow-sm">
                        {savedCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-slate-200 dark:border-white/10 space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-navy-900/50 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-slate-600 dark:text-gray-300"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/dashboard/notifications" className="relative text-slate-600 dark:text-gray-400 hover:text-accent-blue transition-colors">
              <Bell size={20} />
              {unreadCount > 0 && (
                 <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-navy-900 text-[8px] font-bold text-white flex items-center justify-center shadow-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                 </span>
              )}
            </Link>
            <Link to="/dashboard/saved" className="hidden md:block text-slate-600 dark:text-gray-400 hover:text-accent-blue transition-colors relative">
              <Heart size={20} />
              {savedCount > 0 && (
                 <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-navy-900 text-[8px] font-bold text-white flex items-center justify-center shadow-sm">
                    {savedCount > 9 ? '9+' : savedCount}
                 </span>
              )}
            </Link>
            
            {/* User Profile Dropdown */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-white/10">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {currentUser?.name || 'User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-400">Student</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-blue to-accent-violet flex items-center justify-center text-white font-bold cursor-pointer hover:ring-4 ring-accent-blue/20 transition-all uppercase">
                {currentUser?.name?.substring(0,2) || 'US'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-0 md:p-0 scroll-smooth">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
