
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap, DollarSign, Globe, Check, ChevronRight, ChevronLeft, ChevronDown, MapPin, Calendar, Briefcase } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types';

const steps = [
  { id: 1, title: 'Personal Info', icon: <User size={20} /> },
  { id: 2, title: 'Academic Info', icon: <GraduationCap size={20} /> },
  { id: 3, title: 'Financial Info', icon: <DollarSign size={20} /> },
  { id: 4, title: 'Preferences', icon: <Globe size={20} /> },
];

// Reusable Form Components
const FormLabel = ({ children }: { children?: React.ReactNode }) => (
  <label className="text-xs font-bold uppercase text-slate-500 dark:text-gray-400 tracking-wider ml-1 mb-1.5 block">
    {children}
  </label>
);

const InputGroup = ({ icon: Icon, ...props }: any) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent-blue transition-colors">
      <Icon size={18} />
    </div>
    <input 
      className="w-full bg-slate-50 dark:bg-navy-900/50 border border-slate-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 transition-all font-medium"
      {...props}
    />
  </div>
);

const SelectGroup = ({ options, value, onChange, ...props }: { options: string[], value?: string, onChange?: (e: any) => void, [key: string]: any }) => (
  <div className="relative group">
    <select 
      className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-10 py-3.5 text-slate-900 dark:text-white appearance-none focus:outline-none focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 transition-all font-medium cursor-pointer"
      value={value}
      onChange={onChange}
      {...props}
    >
      <option value="" disabled className="bg-white dark:bg-navy-900">Select an option</option>
      {options.map(opt => (
        <option key={opt} value={opt} className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white py-2">
          {opt}
        </option>
      ))}
    </select>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-accent-blue transition-colors pointer-events-none">
      <ChevronDown size={18} />
    </div>
  </div>
);

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile, currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  // Profile State
  const [formData, setFormData] = useState<UserProfile>({
    firstName: currentUser?.name?.split(' ')[0] || '',
    middleName: '',
    lastName: currentUser?.name?.split(' ').slice(1).join(' ') || '',
    
    dob: '',
    gender: '',
    nationality: 'Filipino',
    location: '',
    
    educationLevel: '',
    schoolName: '',
    major: '',
    gpa: '',
    
    incomeRange: '',
    householdSize: 0,
    isWorkingStudent: false,
    
    preferredType: [],
    preferredLocation: 'Local',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean, isArray = false, value = '') => {
    if (isArray) {
        setFormData(prev => {
            const list = prev[name as keyof UserProfile] as string[] || [];
            if (checked) return { ...prev, [name]: [...list, value] };
            return { ...prev, [name]: list.filter(i => i !== value) };
        });
    } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(curr => curr + 1);
    } else {
      // Save and Complete
      const fullName = `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`;
      updateProfile({ 
          name: fullName.trim(), 
          profile: { ...formData, fullName: fullName.trim() } 
      });
      navigate('/dashboard');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <FormLabel>First Name</FormLabel>
                <InputGroup icon={User} type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Juan" />
              </div>
              <div>
                <FormLabel>Middle Name</FormLabel>
                <InputGroup icon={User} type="text" name="middleName" value={formData.middleName} onChange={handleChange} placeholder="Dela" />
              </div>
              <div>
                <FormLabel>Last Name</FormLabel>
                <InputGroup icon={User} type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Cruz" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <FormLabel>Date of Birth</FormLabel>
                    <InputGroup icon={Calendar} type="date" name="dob" value={formData.dob} onChange={handleChange} />
                </div>
                
                <div>
                    <FormLabel>Gender</FormLabel>
                    <SelectGroup options={['Male', 'Female', 'Non-binary', 'Prefer not to say']} name="gender" value={formData.gender} onChange={handleChange} />
                </div>
            </div>
              
            <div>
              <FormLabel>Nationality</FormLabel>
              <InputGroup icon={Globe} type="text" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="e.g. Filipino" />
            </div>
            
            <div className="col-span-full">
              <FormLabel>Current Location</FormLabel>
              <InputGroup icon={MapPin} type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Quezon City, Metro Manila" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <FormLabel>Education Level</FormLabel>
              <SelectGroup options={['Senior High School', 'Undergraduate', 'Graduate (Masters/PhD)', 'Vocational / TVET']} name="educationLevel" value={formData.educationLevel} onChange={handleChange} />
            </div>
            
            <div>
              <FormLabel>School / University</FormLabel>
              <InputGroup icon={GraduationCap} type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} placeholder="e.g. University of the Philippines" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <FormLabel>Major / Strand</FormLabel>
                <InputGroup icon={Briefcase} type="text" name="major" value={formData.major} onChange={handleChange} placeholder="e.g. BS Computer Science" />
              </div>
              <div>
                <FormLabel>GWA / GPA</FormLabel>
                <InputGroup icon={Check} type="text" name="gpa" value={formData.gpa} onChange={handleChange} placeholder="e.g. 1.50 or 95%" />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <FormLabel>Annual Family Income Range</FormLabel>
              <SelectGroup options={['Under ₱150,000', '₱150,000 - ₱300,000', '₱300,000 - ₱500,000', 'Above ₱500,000']} name="incomeRange" value={formData.incomeRange} onChange={handleChange} />
            </div>
            
            <div>
              <FormLabel>Household Size</FormLabel>
              <InputGroup icon={User} type="number" name="householdSize" value={formData.householdSize} onChange={handleChange} placeholder="e.g. 4" />
            </div>
            
            <div className="pt-2">
              <label className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 cursor-pointer hover:border-accent-blue transition-all group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    className="peer w-6 h-6 border-2 border-slate-300 dark:border-gray-500 rounded-lg text-accent-blue focus:ring-0 checked:bg-accent-blue checked:border-accent-blue transition-all appearance-none cursor-pointer" 
                    checked={formData.isWorkingStudent}
                    onChange={(e) => handleCheckboxChange('isWorkingStudent', e.target.checked)}
                  />
                  <Check size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity scale-0 peer-checked:scale-100" strokeWidth={3} />
                </div>
                <div>
                   <span className="font-bold text-slate-700 dark:text-gray-200 group-hover:text-accent-blue transition-colors">Are you a working student?</span>
                   <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Select this if you are currently employed while studying.</p>
                </div>
              </label>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <FormLabel>Preferred Scholarship Type</FormLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {['Full Scholarship', 'Merit-based', 'Need-based', 'Government', 'NGO', 'Research'].map(type => (
                  <label key={type} className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-white/10 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 hover:border-accent-blue/50 transition-all group">
                    <div className="relative flex items-center justify-center">
                       <input 
                        type="checkbox" 
                        className="peer w-5 h-5 border-2 border-slate-300 dark:border-gray-500 rounded text-accent-blue focus:ring-0 checked:bg-accent-blue checked:border-accent-blue transition-all appearance-none cursor-pointer" 
                        checked={formData.preferredType?.includes(type)}
                        onChange={(e) => handleCheckboxChange('preferredType', e.target.checked, true, type)}
                       />
                       <Check size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-gray-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <FormLabel>Preferred Location</FormLabel>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                {['Local', 'International'].map(loc => (
                  <label key={loc} className="flex-1 flex items-center justify-center gap-3 p-5 rounded-2xl border border-slate-200 dark:border-white/10 cursor-pointer hover:border-accent-blue hover:bg-accent-blue/5 transition-all has-[:checked]:bg-accent-blue/10 has-[:checked]:border-accent-blue has-[:checked]:ring-1 has-[:checked]:ring-accent-blue relative overflow-hidden group">
                    <input 
                        type="radio" 
                        name="preferredLocation" 
                        value={loc}
                        checked={formData.preferredLocation === loc}
                        onChange={handleChange}
                        className="hidden peer" 
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-gray-500 peer-checked:border-accent-blue peer-checked:bg-accent-blue flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="font-bold text-slate-700 dark:text-white group-hover:text-accent-blue transition-colors">{loc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-slate-50 dark:bg-navy-950">
      <div className="w-full max-w-3xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">Complete Your Profile</h1>
          <p className="text-slate-600 dark:text-gray-400 text-lg">Help us find the best Philippine scholarships for you.</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10 px-4">
          <div className="flex justify-between relative max-w-2xl mx-auto">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-navy-800 -z-10 -translate-y-1/2 rounded-full"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-accent-blue to-accent-violet -z-10 -translate-y-1/2 transition-all duration-500 rounded-full" 
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            ></div>

            {steps.map((step) => {
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;

              return (
                <div key={step.id} className="flex flex-col items-center gap-2 group">
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 relative z-10
                    ${isActive || isCompleted 
                      ? 'bg-white dark:bg-navy-900 border-accent-blue text-accent-blue shadow-[0_0_20px_rgba(79,139,255,0.3)]' 
                      : 'bg-slate-100 dark:bg-navy-900 border-slate-300 dark:border-navy-700 text-slate-400'
                    }
                    ${isActive && 'scale-110 ring-4 ring-accent-blue/20'}
                  `}>
                    {isCompleted ? <Check size={22} strokeWidth={3} /> : step.icon}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wide hidden sm:block transition-colors ${isActive ? 'text-accent-blue' : 'text-slate-400'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <GlassCard className="p-8 md:p-10 min-h-[480px] flex flex-col bg-white/80 dark:bg-navy-900/80 backdrop-blur-2xl border border-white/50 dark:border-white/5 shadow-2xl">
          <div className="flex-grow">
             <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200 dark:border-white/10">
               <div className="p-2 bg-accent-blue/10 rounded-lg text-accent-blue">
                 {steps[currentStep-1].icon}
               </div>
               <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                 {steps[currentStep-1].title}
               </h2>
             </div>
             
             {renderStepContent()}
          </div>

          <div className="flex justify-between pt-8 mt-6 border-t border-slate-100 dark:border-white/5">
            <Button 
              variant="ghost" 
              onClick={handlePrev} 
              disabled={currentStep === 1}
              className={`${currentStep === 1 ? 'invisible' : ''} hover:bg-slate-100 dark:hover:bg-white/5`}
            >
              <ChevronLeft className="mr-1" size={18} /> Back
            </Button>
            <Button 
              variant="primary" 
              onClick={handleNext}
              className="px-8 shadow-xl shadow-accent-blue/20"
            >
              {currentStep === 4 ? 'Complete Profile' : 'Next Step'} 
              {currentStep !== 4 && <ChevronRight className="ml-1" size={18} />}
            </Button>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};

export default Onboarding;
