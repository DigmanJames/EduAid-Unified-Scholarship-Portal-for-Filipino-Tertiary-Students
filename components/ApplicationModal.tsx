
import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, FileText, Upload, User, GraduationCap, MapPin, ChevronRight, Loader2, ShieldCheck, AlertCircle, Trash2, Mail, HeartHandshake, DollarSign } from 'lucide-react';
import Button from './Button';
import { Scholarship } from '../types';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';

interface ApplicationModalProps {
  scholarship: Scholarship | null;
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ scholarship, isOpen, onClose }) => {
  const { applyForScholarship, applications } = useUser();
  const { currentUser } = useAuth(); // Get real user data
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statement, setStatement] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  
  // File Upload State
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Reset state when opening a new scholarship
  useEffect(() => {
    if (isOpen && scholarship) {
      // Check for existing application
      const hasApplied = applications.some(app => app.scholarshipId === scholarship.id);
      setAlreadyApplied(hasApplied);

      setStep(1);
      setIsSubmitting(false);
      setStatement('');
      setFiles([]); // Reset files
    }
  }, [isOpen, scholarship, applications]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      // Optional: Check for duplicates or size limits here
      setFiles((prev) => [...prev, ...newFiles]);
    }
    // Reset input value so same file can be selected again if needed (though we append)
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen || !scholarship) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Call Context Action with Files
    applyForScholarship(scholarship, files);
    
    setIsSubmitting(false);
    setStep(3); // Success step
  };

  // Helper to display user data or placeholder
  const profile = currentUser?.profile || {};
  
  // Construct Display Name from Profile Split Fields or Fallback to Account Name
  const displayName = (profile.firstName && profile.lastName) 
    ? `${profile.firstName} ${profile.middleName ? profile.middleName + ' ' : ''}${profile.lastName}` 
    : currentUser?.name || 'Guest User';

  // Calculate Response Date (Deadline + 3 Business Days)
  const getResponseDate = (deadlineStr: string) => {
    const date = new Date(deadlineStr);
    let businessDaysAdded = 0;
    
    // If deadline is invalid or passed, default to today
    if (isNaN(date.getTime())) return "TBA";

    // Add 3 business days
    while (businessDaysAdded < 3) {
        date.setDate(date.getDate() + 1);
        const day = date.getDay();
        // 0 is Sunday, 6 is Saturday
        if (day !== 0 && day !== 6) {
            businessDaysAdded++;
        }
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const expectedResponseDate = getResponseDate(scholarship.deadline);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-white/5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[250px] sm:max-w-xs">
              {step === 3 ? 'Application Sent' : alreadyApplied ? 'Application Status' : `Apply to ${scholarship.sponsor}`}
            </h2>
            <p className="text-xs text-slate-500 dark:text-gray-400 truncate max-w-[250px]">
              {scholarship.title}
            </p>
          </div>
          {step !== 3 && (
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-gray-400 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {/* ALREADY APPLIED STATE */}
          {alreadyApplied && (
             <div className="flex flex-col items-center justify-center text-center py-8 animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-6">
                   <CheckCircle size={40} strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">You already applied!</h3>
                <p className="text-slate-600 dark:text-gray-300 max-w-xs mx-auto mb-8">
                   You have already submitted an application for <strong>{scholarship.title}</strong>.
                </p>
                <Button variant="outline" onClick={onClose}>
                   Close
                </Button>
             </div>
          )}

          {/* STEP 1: REVIEW PROFILE */}
          {!alreadyApplied && step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20 flex gap-3">
                <InfoIcon className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your complete profile will be submitted to the sponsor. Please confirm your details.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Applicant Details</h3>
                
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 space-y-6">
                  {/* Header Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center font-bold text-lg uppercase">
                      {profile.firstName ? profile.firstName.charAt(0) : (currentUser?.name?.substring(0, 1) || <User size={20} />)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-bold text-slate-900 dark:text-white truncate">{displayName}</p>
                      <p className="text-xs text-slate-500 dark:text-gray-400 truncate flex items-center gap-1">
                        <Mail size={10} /> {currentUser?.email}
                      </p>
                      <div className="flex gap-2 mt-1 text-xs text-slate-500">
                         <span>{profile.age ? `${profile.age} yrs old` : 'Age N/A'}</span>
                         <span>•</span>
                         <span>{profile.gender || 'Gender N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-slate-200 dark:bg-white/10"></div>
                  
                  {/* Detailed Grid */}
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                        <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><GraduationCap size={10} /> Education</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{profile.educationLevel || 'N/A'}</p>
                        <p className="text-xs text-slate-500">{profile.schoolName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><MapPin size={10} /> Location</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{profile.location || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><FileText size={10} /> Major / Strand</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{profile.major || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><CheckCircle size={10} /> GWA / GPA</p>
                        <p className="text-sm font-bold text-accent-blue">{profile.gpa || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><DollarSign size={10} /> Income Range</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{profile.incomeRange || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><HeartHandshake size={10} /> Guardian</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{profile.guardianName || 'N/A'}</p>
                        <p className="text-xs text-slate-500">{profile.guardianRelationship}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400 justify-center">
                 <ShieldCheck size={14} />
                 <span>Verified Profile • Ready for Submission</span>
              </div>
            </div>
          )}

          {/* STEP 2: REQUIREMENTS */}
          {!alreadyApplied && step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText size={16} className="text-accent-blue" /> Personal Statement
                </label>
                <textarea 
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="Tell us why you deserve this scholarship... (Optional)"
                  className="w-full h-32 glass-input p-4 rounded-xl text-sm focus:ring-2 focus:ring-accent-blue/50 outline-none resize-none dark:text-white"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Upload size={16} className="text-accent-violet" /> Supporting Documents
                </label>
                
                {/* Hidden File Input */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    multiple 
                    accept=".pdf,.jpg,.png,.jpeg,.doc,.docx"
                />

                {/* Dropzone Trigger */}
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer active:scale-[0.99] group"
                >
                  <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400 group-hover:text-accent-violet group-hover:scale-110 transition-all">
                     <Upload size={20} />
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-gray-300">Click to attach files</p>
                  <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">PDF, Docs, Images (Max 5MB)</p>
                </div>
                
                {/* Attached Files List */}
                <div className="space-y-2">
                   {files.length > 0 ? (
                       files.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg animate-in fade-in slide-in-from-top-1">
                            <div className="p-1.5 bg-green-100 dark:bg-green-500/20 rounded text-green-600 dark:text-green-400">
                                <FileText size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-slate-700 dark:text-gray-300 truncate">
                                    {file.name}
                                </p>
                                <p className="text--[10px] text-slate-400">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <button 
                                onClick={() => removeFile(index)}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                       ))
                   ) : (
                       <p className="text-xs text-slate-400 text-center italic mt-2">No files attached yet.</p>
                   )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {!alreadyApplied && step === 3 && (
             <div className="flex flex-col items-center justify-center text-center py-8 animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-500 dark:text-green-400 mb-6 shadow-xl shadow-green-500/20">
                   <CheckCircle size={40} strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Application Submitted!</h3>
                <p className="text-slate-600 dark:text-gray-300 max-w-xs mx-auto mb-8">
                   Your application for <strong>{scholarship.title}</strong> has been sent to {scholarship.sponsor}.
                </p>
                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-sm text-slate-500 dark:text-gray-400">
                   Expected response by: <span className="font-bold text-slate-700 dark:text-white">{expectedResponseDate}</span>
                </div>
             </div>
          )}
        </div>

        {/* Footer Actions */}
        {!alreadyApplied && (
            <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-navy-900/50 backdrop-blur-md flex justify-end gap-3">
            {step === 1 && (
                <>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={() => setStep(2)}>
                    Continue <ChevronRight size={16} className="ml-1" />
                </Button>
                </>
            )}
            
            {step === 2 && (
                <>
                <Button variant="ghost" onClick={() => setStep(1)} disabled={isSubmitting}>Back</Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting} className="min-w-[120px]">
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Submit Application'}
                </Button>
                </>
            )}

            {step === 3 && (
                <Button variant="primary" fullWidth onClick={onClose}>
                Done
                </Button>
            )}
            </div>
        )}
      </div>
    </div>
  );
};

const InfoIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width="20" height="20">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export default ApplicationModal;
