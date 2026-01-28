
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Background from './components/Background';
import Home from './pages/Home';
import Scholarships from './pages/Scholarships';
import Auth from './pages/Auth';
import HowItWorks from './pages/HowItWorks';
import SuccessStories from './pages/SuccessStories';
import HelpCenter from './pages/HelpCenter';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Onboarding from './pages/Onboarding';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import SavedScholarships from './pages/dashboard/SavedScholarships';
import MyApplications from './pages/dashboard/MyApplications';
import ProfileSettings from './pages/dashboard/ProfileSettings';
import Notifications from './pages/dashboard/Notifications';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminApplications from './pages/admin/AdminApplications';
import AdminScholarships from './pages/admin/AdminScholarships';
import { ThemeProvider } from './context/ThemeContext';
import { ScholarshipProvider } from './context/ScholarshipContext';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ScholarshipProvider>
          <UserProvider>
            <Router>
              <div className="min-h-screen flex flex-col font-sans antialiased selection:bg-accent-blue/30 selection:text-white text-slate-900 dark:text-gray-100">
                <Background />
                
                <Routes>
                  {/* Public Routes with Public Navbar */}
                  <Route path="/" element={<><Navbar /><main className="flex-grow"><Home /></main><Footer /></>} />
                  <Route path="/scholarships" element={<><Navbar /><main className="flex-grow"><Scholarships /></main><Footer /></>} />
                  <Route path="/how-it-works" element={<><Navbar /><main className="flex-grow"><HowItWorks /></main><Footer /></>} />
                  <Route path="/success-stories" element={<><Navbar /><main className="flex-grow"><SuccessStories /></main><Footer /></>} />
                  <Route path="/help" element={<><Navbar /><main className="flex-grow"><HelpCenter /></main><Footer /></>} />
                  <Route path="/terms" element={<><Navbar /><main className="flex-grow"><TermsOfService /></main><Footer /></>} />
                  <Route path="/privacy" element={<><Navbar /><main className="flex-grow"><PrivacyPolicy /></main><Footer /></>} />
                  <Route path="/login" element={<><Navbar /><main className="flex-grow"><Auth /></main><Footer /></>} />
                  <Route path="/signup" element={<><Navbar /><main className="flex-grow"><Auth /></main><Footer /></>} />
                  <Route path="/admin" element={<><Navbar /><main className="flex-grow"><Auth /></main><Footer /></>} />
                  
                  {/* Onboarding Route (No Navbar/Footer for focus) */}
                  <Route path="/onboarding" element={<main className="flex-grow"><Onboarding /></main>} />

                  {/* Dashboard Routes (Protected, uses DashboardLayout) */}
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="scholarships" element={<Scholarships />} /> {/* Reusing scholarships page but inside dash */}
                    <Route path="saved" element={<SavedScholarships />} />
                    <Route path="applications" element={<MyApplications />} />
                    <Route path="profile" element={<ProfileSettings />} />
                    <Route path="notifications" element={<Notifications />} />
                  </Route>

                  {/* Admin Routes (Protected, uses AdminLayout) */}
                  <Route path="/admin-dashboard" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="applications" element={<AdminApplications />} />
                    <Route path="scholarships" element={<AdminScholarships />} />
                  </Route>
                </Routes>
                
              </div>
            </Router>
          </UserProvider>
        </ScholarshipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
