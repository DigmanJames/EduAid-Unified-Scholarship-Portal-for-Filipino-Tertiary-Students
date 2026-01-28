
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, LogOut, Menu, X, Shield, FileText, GraduationCap, Users
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/admin-dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Applications', path: '/admin-dashboard/applications', icon: <FileText size={20} /> },
    { label: 'Scholarships', path: '/admin-dashboard/scholarships', icon: <GraduationCap size={20} /> },
  ];

  const handleLogout = async () => {
    await logout(); // Wait for logout to complete
    navigate('/admin', { replace: true }); // Force redirect immediately to admin login
  };

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
        bg-navy-900 text-white backdrop-blur-xl border-r border-white/5
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex flex-col h-full">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-accent-blue/20 rounded-lg border border-accent-blue/30">
              <Shield className="w-6 h-6 text-accent-blue" />
            </div>
            <div>
               <span className="text-xl font-bold font-heading text-white block">
                  EduAid
               </span>
               <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Admin Portal</span>
            </div>
            <button className="md:hidden ml-auto text-white" onClick={() => setIsSidebarOpen(false)}>
              <X />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-grow space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin-dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-accent-blue text-white font-semibold shadow-lg shadow-accent-blue/20' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-white/10 space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
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
          <div className="flex items-center gap-3 pl-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Admin User</p>
                <p className="text-xs text-slate-500 dark:text-gray-400">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-navy-800 border border-white/20 flex items-center justify-center text-white font-bold">
                AD
              </div>
          </div>
        </header>

        {/* Page Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;