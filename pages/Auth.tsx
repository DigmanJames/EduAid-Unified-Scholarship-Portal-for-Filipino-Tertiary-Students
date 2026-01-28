
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { Mail, Lock, User, Eye, EyeOff, Check, Shield, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Auth: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup, googleLogin, currentUser } = useAuth();
  
  const isLogin = location.pathname === '/login';
  const isAdmin = location.pathname === '/admin';
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') navigate('/admin-dashboard');
      else navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  // Titles and Subtitles based on route
  const title = isAdmin ? 'Admin Portal' : isLogin ? 'Hi there!' : 'Join Us!';
  const subtitle = isAdmin 
    ? 'Secure access for staff.' 
    : isLogin 
      ? 'Have we met before?' 
      : 'Start your journey today.';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isAdmin) {
         // Admin Login
         await login(email, password, rememberMe);
      } else if (isLogin) {
         // User Login
         await login(email, password, rememberMe);
      } else {
         // User Signup
         if (!fullName) {
           setError("Full Name is required");
           setIsSubmitting(false);
           return;
         }
         await signup(fullName, email, password);
         navigate('/onboarding');
      }
    } catch (err: any) {
      console.error("Auth Error:", err.code, err.message);
      // Map Firebase errors to user-friendly messages
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
          setError('Incorrect email or password.');
      } else if (err.code === 'auth/user-not-found') {
          setError('No account found with this email.');
      } else if (err.code === 'auth/email-already-in-use') {
          setError('Email is already registered.');
      } else if (err.code === 'auth/too-many-requests') {
          setError('Too many attempts. Please try again later.');
      } else {
          setError('Authentication failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
      setError('');
      setIsGoogleLoading(true);
      try {
          await googleLogin();
          // AuthContext effect will handle redirect
      } catch (err: any) {
          console.error("Google Login Error:", err);
          if (err.code === 'auth/popup-closed-by-user') {
              setError('Login cancelled.');
          } else if (err.code === 'auth/unauthorized-domain') {
              setError('Domain not authorized for Google Sign-in.');
          } else {
              setError('Google login failed. Please try again.');
          }
          setIsGoogleLoading(false);
      }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-slate-50 dark:bg-navy-950">
      
      {/* Main Container Card */}
      <div className="w-full max-w-6xl bg-white dark:bg-navy-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[600px] border border-white/20">
        
        {/* LEFT SIDE: Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10">
          <div className="max-w-md mx-auto w-full">
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6 lg:hidden">
                 <div className="p-2 bg-accent-violet/10 rounded-lg">
                   <Shield className="w-6 h-6 text-accent-violet" />
                 </div>
                 <span className="font-bold text-xl text-slate-900 dark:text-white">EduAid</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 font-heading">
                {title}
              </h1>
              <p className="text-slate-500 dark:text-gray-400 text-lg">
                {subtitle}
              </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                    <AlertCircleIcon size={16} />
                    {error}
                </div>
            )}

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              
              {/* Full Name (Signup Only) */}
              {!isLogin && !isAdmin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-gray-300 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent-violet transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin}
                      className="w-full bg-slate-50 dark:bg-navy-950/50 border border-slate-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:border-accent-violet focus:ring-4 focus:ring-accent-violet/10 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-gray-300 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent-violet transition-colors" size={20} />
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-navy-950/50 border border-slate-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:border-accent-violet focus:ring-4 focus:ring-accent-violet/10 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-gray-300 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent-violet transition-colors" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-navy-950/50 border border-slate-200 dark:border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:border-accent-violet focus:ring-4 focus:ring-accent-violet/10 outline-none transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${rememberMe ? 'bg-accent-violet border-accent-violet' : 'border-slate-300 dark:border-white/20 bg-white dark:bg-white/5'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    {rememberMe && <Check size={12} className="text-white" />}
                  </div>
                  <span className="text-sm text-slate-500 dark:text-gray-400 group-hover:text-slate-700 dark:group-hover:text-gray-200 transition-colors">Remember me</span>
                </label>
                
                <Link to="#" className="text-sm font-medium text-accent-violet hover:text-accent-blue transition-colors">
                  Forgot my password
                </Link>
              </div>

              {/* Submit Button */}
              <Button 
                fullWidth 
                size="lg"
                type="submit"
                disabled={isSubmitting}
                className="bg-accent-violet hover:bg-indigo-600 text-white shadow-xl shadow-accent-violet/20 mt-4 py-4 rounded-xl font-bold text-base"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  isAdmin ? 'Authenticate' : isLogin ? 'Log in' : 'Create Account'
                )}
              </Button>
            </form>

            {/* Social Login */}
            {!isAdmin && (
              <>
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-navy-900 px-4 text-slate-400 dark:text-gray-500 font-medium tracking-wider">Or</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    className="flex items-center justify-center gap-3 py-3.5 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:bg-white hover:shadow-lg dark:hover:bg-white/10 transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isGoogleLoading ? (
                        <Loader2 className="animate-spin text-slate-500 dark:text-gray-400" size={20} />
                    ) : (
                        <>
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            <span className="text-sm font-semibold text-slate-600 dark:text-gray-200 group-hover:text-slate-900 dark:group-hover:text-white">Log in with Google</span>
                        </>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Toggle Auth Mode */}
            <div className="mt-8 text-center">
              <p className="text-slate-500 dark:text-gray-400 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Link 
                  to={isLogin ? '/signup' : '/login'} 
                  className="font-bold text-accent-violet hover:text-indigo-600 dark:text-accent-violet dark:hover:text-accent-cyan transition-colors"
                >
                  {isLogin ? 'Sign Up' : 'Log In'}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: 3D Visual (Hidden on Mobile) */}
        <div className="hidden lg:flex relative items-center justify-center bg-slate-100 dark:bg-navy-950/50 overflow-hidden perspective-1000">
            {/* Visuals kept same as previous... */}
             <div className="absolute inset-0 w-[200%] h-[200%] -left-[50%] -top-[50%] animate-[spin_60s_linear_infinite]"
                 style={{ 
                   backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
                   backgroundSize: '80px 80px',
                   transform: 'perspective(500px) rotateX(60deg)',
                 }}>
            </div>
            
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-violet/30 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-blue/30 rounded-full blur-[100px] animate-pulse delay-1000"></div>

            <div className="relative z-10 w-80 h-96 transform rotate-y-12 rotate-x-6 transition-transform hover:rotate-y-0 hover:rotate-x-0 duration-500">
                <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center transform transition-transform hover:-translate-y-2">
                    <div className="relative w-32 h-32 flex items-center justify-center mb-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-violet to-indigo-600 rounded-[2rem] opacity-20 transform rotate-45"></div>
                        <div className="absolute inset-2 bg-gradient-to-br from-accent-violet to-indigo-600 rounded-[1.5rem] opacity-40 transform rotate-45 blur-md"></div>
                        <div className="relative z-10 p-4 bg-gradient-to-br from-white to-slate-200 dark:from-navy-800 dark:to-navy-900 rounded-2xl shadow-inner">
                           <User size={48} className="text-accent-violet" />
                        </div>
                        <div className="absolute -inset-8 border border-white/30 rounded-full animate-[spin_8s_linear_infinite]">
                           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 w-3 h-3 bg-accent-cyan rounded-full shadow-[0_0_10px_currentColor]"></div>
                        </div>
                    </div>
                    <div className="flex gap-3 mb-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-3 h-3 rounded-full bg-accent-violet animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
                        ))}
                    </div>
                    <div className="w-16 h-1 bg-white/20 rounded-full"></div>
                </div>
                <div className="absolute -right-12 top-12 w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 transform rotate-12 animate-[float_4s_ease-in-out_infinite]"></div>
                <div className="absolute -left-8 bottom-20 w-16 h-16 bg-accent-violet/20 backdrop-blur-md rounded-xl border border-white/10 transform -rotate-6 animate-[float_5s_ease-in-out_infinite_1s]"></div>
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-b from-slate-300/50 to-slate-400/20 dark:from-white/10 dark:to-transparent transform rotate-x-[60deg] rounded-full blur-sm"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

// Helper for icon not imported
const AlertCircleIcon = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

export default Auth;
