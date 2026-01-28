import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-white/50 dark:bg-navy-900/50 backdrop-blur-lg mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <GraduationCap className="w-6 h-6 text-accent-blue" />
               <span className="text-xl font-bold text-slate-900 dark:text-white">EduAid</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-gray-400">
              Empowering students through accessible education. 
              Find the financial support you need to build your future.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/scholarships" className="text-sm text-slate-600 hover:text-accent-blue dark:text-gray-400 dark:hover:text-accent-cyan">Browse Scholarships</Link></li>
              <li><Link to="/how-it-works" className="text-sm text-slate-600 hover:text-accent-blue dark:text-gray-400 dark:hover:text-accent-cyan">How it works</Link></li>
              <li><Link to="/success-stories" className="text-sm text-slate-600 hover:text-accent-blue dark:text-gray-400 dark:hover:text-accent-cyan">Success Stories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-sm text-slate-600 hover:text-accent-blue dark:text-gray-400 dark:hover:text-accent-cyan">Help Center</Link></li>
              <li><Link to="/terms" className="text-sm text-slate-600 hover:text-accent-blue dark:text-gray-400 dark:hover:text-accent-cyan">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-sm text-slate-600 hover:text-accent-blue dark:text-gray-400 dark:hover:text-accent-cyan">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-accent-blue dark:text-gray-400 dark:hover:text-accent-blue transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-accent-blue dark:text-gray-400 dark:hover:text-accent-blue transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-accent-blue dark:text-gray-400 dark:hover:text-accent-blue transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-accent-blue dark:text-gray-400 dark:hover:text-accent-blue transition-colors"><Instagram size={20} /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10 text-center text-xs text-slate-500 dark:text-gray-500">
          &copy; {new Date().getFullYear()} EduAid Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;