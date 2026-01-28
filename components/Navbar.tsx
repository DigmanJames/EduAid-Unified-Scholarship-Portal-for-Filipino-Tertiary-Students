import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, GraduationCap, Sun, Moon } from 'lucide-react';
import Button from './Button';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Scholarships', path: '/scholarships' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Success Stories', path: '/success-stories' },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 left-0 border-b border-slate-200 dark:border-white/10 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-accent-blue/10 dark:bg-accent-blue/20 rounded-lg border border-accent-blue/30 group-hover:border-accent-blue/60 transition-all">
              <GraduationCap className="w-6 h-6 text-accent-blue" />
            </div>
            <span className="text-2xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-navy-900 to-slate-600 dark:from-white dark:to-gray-400">
              EduAid
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path) 
                    ? 'text-accent-blue dark:text-accent-cyan' 
                    : 'text-slate-600 hover:text-navy-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 hover:text-navy-900 hover:bg-slate-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {!currentUser && (
               <Link to="/admin" className="text-xs text-slate-500 hover:text-navy-900 dark:text-gray-500 dark:hover:text-gray-300 flex items-center gap-1">
                 <Shield size={12} /> Admin
               </Link>
            )}

            {currentUser ? (
               <Link to="/dashboard">
                 <Button variant="primary" size="sm" className="glow-button">Go to Dashboard</Button>
               </Link>
            ) : (
               <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm" className="glow-button">Sign Up</Button>
                </Link>
               </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-gray-300"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-800 dark:text-gray-300 hover:text-navy-900 dark:hover:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-navy-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3 border-t border-slate-200 dark:border-white/10 mt-4">
              {currentUser ? (
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" fullWidth>Dashboard</Button>
                  </Link>
              ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" fullWidth>Login</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                        <Button variant="primary" fullWidth>Sign Up</Button>
                    </Link>
                  </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;