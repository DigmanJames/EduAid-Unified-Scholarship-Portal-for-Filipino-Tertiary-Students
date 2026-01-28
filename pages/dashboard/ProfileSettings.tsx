import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { 
  User, Shield, Save, Mail, Phone, 
  MapPin, GraduationCap, AlertTriangle, Trash2, Eye, EyeOff, CheckCircle, Users, Calendar, HeartHandshake
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserProfile } from '../../types';

const ProfileSettings: React.FC = () => {
  const { currentUser, updateProfile, changePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'general' | 'academic' | 'security'>('general');
  
  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Security Tab State
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Profile Data state loaded from currentUser.profile
  const [profileData, setProfileData] = useState<UserProfile>({
    firstName: '',
    middleName: '',
    lastName: '',
    age: '',
    gender: '',
    guardianName: '',
    guardianRelationship: '',
    guardianContact: '',
    schoolName: '',
    studentId: '',
    major: '',
    gpa: '',
    location: '',
    educationLevel: '',
    incomeRange: '',
    householdSize: 0,
    ...currentUser?.profile
  });

  const [email, setEmail] = useState(currentUser?.email || '');

  // Update local state when currentUser changes
  useEffect(() => {
    if (currentUser) {
        setEmail(currentUser.email);
        setProfileData(prev => ({ 
            ...prev, 
            ...currentUser.profile, 
            location: currentUser.profile?.location || ''
        }));
    }
  }, [currentUser]);

  // Dynamic Profile Strength Calculation
  const profileStrength = useMemo(() => {
    const fields = [
      profileData.firstName,
      profileData.lastName,
      profileData.phone,
      profileData.location,
      profileData.age,
      profileData.gender,
      profileData.guardianName,
      profileData.educationLevel,
      profileData.schoolName,
      profileData.major,
      profileData.gpa,
      profileData.incomeRange
    ];
    
    const filledFields = fields.filter(field => field && field.toString().trim() !== '').length;
    const totalFields = fields.length;
    
    return Math.round((filledFields / totalFields) * 100);
  }, [profileData]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
     // Construct full name for display purposes
     const fullName = `${profileData.firstName} ${profileData.middleName ? profileData.middleName + ' ' : ''}${profileData.lastName}`;
     
     updateProfile({ 
         name: fullName.trim() || currentUser?.name, 
         email: email, 
         profile: { ...profileData, fullName: fullName.trim() } 
     });
     alert("Profile Updated Successfully");
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
        alert("Please fill in all password fields.");
        return;
    }
    if (newPassword !== confirmPassword) {
        alert("New passwords do not match.");
        return;
    }
    if (newPassword.length < 8) {
        alert("Password must be at least 8 characters.");
        return;
    }

    try {
        await changePassword(currentPassword, newPassword);
        alert("Password updated successfully.");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    } catch (error: any) {
        console.error("Update Password Error:", error.code, error.message);
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
            alert("Incorrect current password.");
        } else if (error.code === 'auth/too-many-requests') {
            alert("Too many attempts. Please try again later.");
        } else {
            alert(error.message || "Failed to update password.");
        }
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAccount();
      setIsDeleteModalOpen(false);
      navigate('/'); // Redirect to Home
    } catch (e) {
      alert("Error deleting account.");
    }
  };

  const SidebarItem = ({ id, icon, label, desc }: { id: typeof activeTab, icon: React.ReactNode, label: string, desc: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200 border ${
        activeTab === id 
          ? 'bg-white dark:bg-white/10 border-accent-blue/30 shadow-lg shadow-accent-blue/5' 
          : 'border-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-gray-400'
      }`}
    >
      <div className={`p-3 rounded-xl ${activeTab === id ? 'bg-accent-blue text-white shadow-md' : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-gray-400'}`}>
        {icon}
      </div>
      <div>
        <h4 className={`font-bold text-sm ${activeTab === id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-gray-300'}`}>{label}</h4>
        <p className="text-xs opacity-70 truncate max-w-[120px]">{desc}</p>
      </div>
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col lg:flex-row gap-8 p-6 md:p-8">
      
      {/* Left Sidebar */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
        {/* Title */}
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
           <p className="text-slate-500 dark:text-gray-400 text-sm">Manage your account preferences.</p>
        </div>

        {/* Nav Menu */}
        <div className="space-y-3">
          <SidebarItem 
            id="general" 
            icon={<User size={20} />} 
            label="Personal Info" 
            desc="Name, Bio, Guardian" 
          />
          <SidebarItem 
            id="academic" 
            icon={<GraduationCap size={20} />} 
            label="Academic & Financial" 
            desc="School, GPA, Income" 
          />
          <SidebarItem 
            id="security" 
            icon={<Shield size={20} />} 
            label="Security" 
            desc="Password, Deletion" 
          />
        </div>

        {/* Widget: Profile Strength */}
        <GlassCard className="p-5 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
              <Shield size={80} />
           </div>
           <h4 className="font-bold text-slate-900 dark:text-white mb-2">Profile Strength</h4>
           <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                 <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        profileStrength < 50 ? 'bg-red-500' : 
                        profileStrength < 80 ? 'bg-yellow-500' : 'bg-gradient-to-r from-accent-blue to-accent-cyan'
                    }`}
                    style={{ width: `${profileStrength}%` }}
                 ></div>
              </div>
              <span className={`text-sm font-bold ${
                  profileStrength < 50 ? 'text-red-500' : 
                  profileStrength < 80 ? 'text-yellow-500' : 'text-accent-blue'
              }`}>{profileStrength}%</span>
           </div>
           <p className="text-xs text-slate-500 dark:text-gray-400 mb-3">
             {profileStrength < 100 ? "Complete your profile to get better scholarship matches." : "Great job! Your profile is complete."}
           </p>
        </GlassCard>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        
        {/* General Tab Content */}
        {activeTab === 'general' && (
          <div className="space-y-6 animate-fadeIn mt-2">
            
            {/* Personal Details */}
            <GlassCard className="p-8">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <User size={20} className="text-accent-blue" /> Personal Details
                 </h3>
                 <Button variant="primary" size="sm" icon={<Save size={16} />} onClick={handleSave}>Save Changes</Button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                     <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">First Name</label>
                     <input 
                        type="text" 
                        name="firstName"
                        value={profileData.firstName || ''}
                        onChange={handleProfileChange}
                        className="w-full glass-input p-3 rounded-xl dark:text-white font-medium" 
                        placeholder="Juan"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Middle Name</label>
                     <input 
                        type="text" 
                        name="middleName"
                        value={profileData.middleName || ''}
                        onChange={handleProfileChange}
                        className="w-full glass-input p-3 rounded-xl dark:text-white font-medium" 
                        placeholder="Dela"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Last Name</label>
                     <input 
                        type="text" 
                        name="lastName"
                        value={profileData.lastName || ''}
                        onChange={handleProfileChange}
                        className="w-full glass-input p-3 rounded-xl dark:text-white font-medium" 
                        placeholder="Cruz"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                     <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Age</label>
                     <input 
                        type="number" 
                        name="age"
                        value={profileData.age || ''}
                        onChange={handleProfileChange}
                        className="w-full glass-input p-3 rounded-xl dark:text-white font-medium" 
                        placeholder="18"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Gender</label>
                     <select 
                        name="gender"
                        value={profileData.gender || ''}
                        onChange={handleProfileChange}
                        className="w-full glass-input p-3 rounded-xl dark:text-white dark:bg-navy-800 font-medium"
                     >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Date of Birth</label>
                     <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="date" 
                            name="dob"
                            value={profileData.dob || ''}
                            onChange={handleProfileChange}
                            className="w-full glass-input pl-12 pr-4 py-3 rounded-xl dark:text-white font-medium" 
                        />
                     </div>
                  </div>
               </div>
                  
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Email Address</label>
                     <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full glass-input pl-12 pr-4 py-3 rounded-xl dark:text-white font-medium" 
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 tooltip" title="Verified">
                           <CheckCircle size={18} />
                        </div>
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Phone Number</label>
                     <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="tel" 
                            name="phone"
                            value={profileData.phone || ''}
                            onChange={handleProfileChange}
                            placeholder="+63 917 123 4567"
                            className="w-full glass-input pl-12 pr-4 py-3 rounded-xl dark:text-white font-medium" 
                        />
                     </div>
                  </div>

                  <div className="col-span-full space-y-2">
                     <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Location / Address</label>
                     <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            name="location"
                            value={profileData.location || ''}
                            onChange={handleProfileChange}
                            placeholder="Unit 402, Katipunan Ave, Quezon City"
                            className="w-full glass-input pl-12 pr-4 py-3 rounded-xl dark:text-white font-medium" 
                        />
                     </div>
                  </div>

                  <div className="col-span-full space-y-2">
                     <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Bio</label>
                     <textarea 
                        name="bio"
                        value={profileData.bio || ''}
                        onChange={handleProfileChange}
                        className="w-full glass-input p-4 rounded-xl dark:text-white font-medium min-h-[100px]" 
                        placeholder="Tell us a bit about yourself..."
                     ></textarea>
                  </div>
               </div>
            </GlassCard>

            {/* Guardian Information */}
            <GlassCard className="p-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                    <HeartHandshake size={20} className="text-red-500" /> Guardian Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Guardian Name</label>
                        <input 
                            type="text" 
                            name="guardianName"
                            value={profileData.guardianName || ''}
                            onChange={handleProfileChange}
                            className="w-full glass-input p-3 rounded-xl dark:text-white font-medium" 
                            placeholder="Parent/Guardian Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Relationship</label>
                        <select 
                            name="guardianRelationship"
                            value={profileData.guardianRelationship || ''}
                            onChange={handleProfileChange}
                            className="w-full glass-input p-3 rounded-xl dark:text-white dark:bg-navy-800 font-medium"
                        >
                            <option value="">Select</option>
                            <option value="Mother">Mother</option>
                            <option value="Father">Father</option>
                            <option value="Relative">Relative</option>
                            <option value="Legal Guardian">Legal Guardian</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Contact Number</label>
                        <input 
                            type="tel" 
                            name="guardianContact"
                            value={profileData.guardianContact || ''}
                            onChange={handleProfileChange}
                            className="w-full glass-input p-3 rounded-xl dark:text-white font-medium" 
                            placeholder="+63"
                        />
                    </div>
                </div>
            </GlassCard>
          </div>
        )}

        {/* Academic Tab Content */}
        {activeTab === 'academic' && (
           <div className="space-y-6 animate-fadeIn mt-2">
              <GlassCard className="p-8">
                 <div className="flex justify-between items-start mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                       <GraduationCap size={20} className="text-accent-violet" /> Educational Background
                    </h3>
                    <Button 
                      onClick={handleSave} 
                      variant="primary" 
                      size="sm" 
                      icon={<Save size={16} />}
                    >
                      Save Profile
                    </Button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full space-y-2">
                       <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Education Level</label>
                       <select 
                          name="educationLevel"
                          value={profileData.educationLevel}
                          onChange={handleProfileChange}
                          className="w-full glass-input p-3 rounded-xl dark:text-white dark:bg-navy-800 font-medium"
                       >
                          <option value="">Select Level</option>
                          <option value="Senior High School">Senior High School</option>
                          <option value="Undergraduate">Undergraduate</option>
                          <option value="Graduate (Masters/PhD)">Graduate (Masters/PhD)</option>
                          <option value="Vocational / TVET">Vocational / TVET</option>
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">University / School</label>
                       <input 
                          type="text" 
                          name="schoolName"
                          value={profileData.schoolName}
                          onChange={handleProfileChange}
                          className="w-full glass-input p-3 rounded-xl dark:text-white font-medium" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Student ID</label>
                       <input 
                          type="text" 
                          name="studentId"
                          value={profileData.studentId}
                          onChange={handleProfileChange}
                          className="w-full glass-input p-3 rounded-xl dark:text-white font-medium" 
                        />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Degree Program / Major</label>
                       <input 
                          type="text" 
                          name="major"
                          value={profileData.major}
                          onChange={handleProfileChange}
                          className="w-full glass-input p-3 rounded-xl dark:text-white font-medium" 
                        />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Current GWA / GPA</label>
                       <input 
                          type="text" 
                          name="gpa"
                          value={profileData.gpa}
                          onChange={handleProfileChange}
                          className="w-full glass-input p-3 rounded-xl dark:text-white font-medium" 
                        />
                    </div>
                 </div>
              </GlassCard>

              {/* Financial Background */}
              <GlassCard className="p-8">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                    <Users size={20} className="text-green-500" /> Financial Background
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Household Income</label>
                       <select 
                          name="incomeRange"
                          value={profileData.incomeRange || ''}
                          onChange={handleProfileChange}
                          className="w-full glass-input p-3 rounded-xl dark:text-white dark:bg-navy-800 font-medium"
                       >
                          <option value="">Select Range</option>
                          <option value="Under ₱150,000">Under ₱150,000</option>
                          <option value="₱150,000 - ₱300,000">₱150,000 - ₱300,000</option>
                          <option value="₱300,000 - ₱500,000">₱300,000 - ₱500,000</option>
                          <option value="Above ₱500,000">Above ₱500,000</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Household Size</label>
                       <input 
                          type="number" 
                          name="householdSize"
                          value={profileData.householdSize || ''}
                          onChange={handleProfileChange}
                          className="w-full glass-input p-3 rounded-xl dark:text-white font-medium" 
                       />
                    </div>
                 </div>
              </GlassCard>
           </div>
        )}

        {/* Security Tab Content */}
        {activeTab === 'security' && (
           <div className="space-y-6 animate-fadeIn mt-2">
              <GlassCard className="p-8">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Shield size={20} className="text-red-500" /> Security Settings
                 </h3>
                 
                 <div className="max-w-md space-y-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Current Password</label>
                       <div className="relative">
                          <input 
                            type={showCurrentPassword ? "text" : "password"} 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full glass-input p-3 rounded-xl dark:text-white font-medium" 
                          />
                          <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                             {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">New Password</label>
                       <div className="relative">
                            <input 
                                type={showNewPassword ? "text" : "password"} 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Minimum 8 characters" 
                                className="w-full glass-input p-3 rounded-xl dark:text-white font-medium" 
                            />
                            <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Confirm New Password</label>
                       <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password" 
                            className="w-full glass-input p-3 rounded-xl dark:text-white font-medium" 
                        />
                    </div>
                    <div className="pt-2">
                       <Button variant="primary" onClick={handleUpdatePassword}>Update Password</Button>
                    </div>
                 </div>
              </GlassCard>

              {/* Danger Zone / Delete Account */}
              <GlassCard className="p-6 border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-full text-red-600 dark:text-red-400 shrink-0">
                       <AlertTriangle size={24} />
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold text-red-600 dark:text-red-400 mb-1">Delete Account</h4>
                       <p className="text-sm text-slate-600 dark:text-gray-400 mb-4">
                         Permanently remove your Personal details, Academic profile, and Application history. This action cannot be undone.
                       </p>
                       <Button 
                         variant="ghost" 
                         onClick={() => setIsDeleteModalOpen(true)}
                         className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-300"
                         icon={<Trash2 size={16} />}
                       >
                         Delete My Account
                       </Button>
                    </div>
                 </div>
              </GlassCard>
           </div>
        )}

      </div>

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
           <div className="w-full max-w-md bg-white dark:bg-navy-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 p-6">
              <div className="flex flex-col items-center text-center mb-6">
                 <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
                    <AlertTriangle size={32} />
                 </div>
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Are you absolutely sure?</h2>
                 <p className="text-sm text-slate-500 dark:text-gray-400">
                    This action will permanently delete your account and remove all your data from our servers. This cannot be undone.
                 </p>
              </div>
              <div className="flex gap-3">
                 <Button fullWidth variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                 <Button fullWidth variant="danger" onClick={handleConfirmDelete}>
                    Yes, Delete Account
                 </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;