
import React, { useState, useEffect } from 'react';
import GlassCard from '../../components/GlassCard';
import { Eye, CheckCircle, XCircle, ChevronDown, ChevronUp, Clock, AlertCircle, X, Download, FileText, User, Calendar, Mail, GraduationCap, DollarSign, MapPin, PenTool, MessageSquare, Send, HeartHandshake, Trash2 } from 'lucide-react';
import Button from '../../components/Button';
import { useUser } from '../../context/UserContext';
import { useScholarships } from '../../context/ScholarshipContext';
import { Application, ApplicationStatus } from '../../types';
import { getAllUsers } from '../../services/firebaseService';

const getStatusColor = (status: string) => {
  switch(status) {
    case 'Accepted': return 'bg-green-500/20 text-green-600 dark:text-green-400';
    case 'Rejected': return 'bg-red-500/20 text-red-600 dark:text-red-400';
    case 'Under Review': return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
    case 'Exam': return 'bg-purple-500/20 text-purple-600 dark:text-purple-400';
    case 'Interview': return 'bg-orange-500/20 text-orange-600 dark:text-orange-400';
    default: return 'bg-slate-500/20 text-slate-600 dark:text-gray-400';
  }
};

const AdminApplications: React.FC = () => {
  const { allApplications, updateApplicationStatus, deleteApplication } = useUser();
  const { scholarships } = useScholarships();
  
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [validUserIds, setValidUserIds] = useState<Set<string>>(new Set());
  
  // Modal State for Status Updates (Sending Email)
  const [statusModal, setStatusModal] = useState<{
      isOpen: boolean;
      appId: string | null;
      newStatus: ApplicationStatus | null;
  }>({ isOpen: false, appId: null, newStatus: null });
  
  const [adminMessage, setAdminMessage] = useState('');

  // Retrieve all registered users directly from Firestore to check for deleted accounts
  useEffect(() => {
      const fetchUsers = async () => {
          const ids = await getAllUsers();
          setValidUserIds(new Set(ids));
      };
      fetchUsers();
  }, []);

  // Grouping Logic based on Context Data
  const groupedApps = allApplications.reduce((acc, app) => {
    if (!acc[app.scholarshipTitle]) {
      acc[app.scholarshipTitle] = [];
    }
    acc[app.scholarshipTitle].push(app);
    return acc;
  }, {} as Record<string, Application[]>);

  // State to track open/closed accordions
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.keys(groupedApps).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );

  const toggleGroup = (scholarshipName: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [scholarshipName]: !prev[scholarshipName]
    }));
  };

  // Handle Deletion
  const handleDeleteApplication = async (e: React.MouseEvent, appId: string) => {
      e.stopPropagation(); // Prevent row click
      if (window.confirm("Are you sure you want to delete this application? This cannot be undone.")) {
          try {
              await deleteApplication(appId);
          } catch (error) {
              alert("Failed to delete application. Ensure you have permission.");
          }
      }
  };

  // CSV Export Functionality
  const handleExportCSV = () => {
    if (allApplications.length === 0) {
        alert("No data to export.");
        return;
    }

    // 1. Define CSV Headers
    const headers = [
        "Application ID", 
        "Applicant Name", 
        "Email", 
        "Scholarship Title", 
        "Sponsor", 
        "Date Applied", 
        "Status", 
        "Education Level",
        "School", 
        "Major",
        "GPA",
        "Income Range",
        "Location",
        "Is Deleted Account"
    ];

    // 2. Helper to escape special characters (commas, quotes, newlines)
    const escapeCsv = (value: string | number | undefined | null) => {
        const str = String(value || '');
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    // 3. Map Data to Rows
    const rows = allApplications.map(app => [
        app.id,
        app.applicantName,
        app.applicantEmail,
        app.scholarshipTitle,
        app.sponsor,
        app.dateApplied,
        app.status,
        app.applicantProfile?.educationLevel,
        app.applicantProfile?.schoolName,
        app.applicantProfile?.major,
        app.applicantProfile?.gpa,
        app.applicantProfile?.incomeRange,
        app.applicantProfile?.location,
        !validUserIds.has(app.userId) ? 'Yes' : 'No'
    ].map(escapeCsv).join(','));

    // 4. Combine Headers and Rows
    const csvContent = [headers.join(','), ...rows].join('\n');

    // 5. Create Blob and Download Link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `eduaid_applications_export_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Open Modal instead of direct update
  const initiateStatusChange = (id: string, newStatus: ApplicationStatus) => {
      // Pre-fill message based on status
      let defaultMsg = '';
      if (newStatus === 'Exam') defaultMsg = 'You are invited to take the qualifying exam. \n\nDate: \nTime: \nVenue: \n\nPlease bring your ID and exam permit.';
      if (newStatus === 'Interview') defaultMsg = 'You have been shortlisted for an interview. \n\nDate: \nTime: \nLink/Venue: ';
      if (newStatus === 'Accepted') defaultMsg = 'Congratulations! We are pleased to inform you that your application has been accepted.';
      if (newStatus === 'Rejected') defaultMsg = 'Thank you for your application. Unfortunately, we cannot offer you a scholarship at this time.';

      setAdminMessage(defaultMsg);
      setStatusModal({ isOpen: true, appId: id, newStatus });
  };

  // 2. Confirm Update with Message
  const confirmStatusChange = () => {
      if (statusModal.appId && statusModal.newStatus) {
          updateApplicationStatus(statusModal.appId, statusModal.newStatus, adminMessage);
          
          // Update local selected state if viewing details
          if (selectedApp && selectedApp.id === statusModal.appId) {
            setSelectedApp(prev => prev ? { ...prev, status: statusModal.newStatus!, adminMessage: adminMessage } : null);
          }
      }
      setStatusModal({ isOpen: false, appId: null, newStatus: null });
      setAdminMessage('');
  };

  // Helper to check if scholarship still exists
  const isScholarshipActive = (title: string) => {
      return scholarships.some(s => s.title === title);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Applications Management</h1>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV} icon={<Download size={16} />}>
                Export CSV
            </Button>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedApps).length > 0 ? (
            Object.entries(groupedApps).map(([scholarshipName, applicants]: [string, Application[]]) => {
            
            const isActive = isScholarshipActive(scholarshipName);

            return (
            <GlassCard key={scholarshipName} className="p-0 overflow-hidden">
                {/* Header / Accordion Toggle */}
                <div 
                    className="p-4 bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                    onClick={() => toggleGroup(scholarshipName)}
                >
                    <div className="flex items-center gap-3">
                        <h2 className="font-bold text-slate-800 dark:text-white text-lg">{scholarshipName}</h2>
                        <span className="px-2 py-0.5 rounded-full bg-accent-blue/20 text-accent-blue text-xs font-bold">
                            {applicants.length} Applicants
                        </span>
                        {!isActive && (
                            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
                                Closed
                            </span>
                        )}
                    </div>
                    {openGroups[scholarshipName] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>

                {/* Table */}
                {openGroups[scholarshipName] && (
                <div className="overflow-x-auto animate-in slide-in-from-top-2 duration-200">
                    <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-white/5 text-sm text-slate-500 dark:text-gray-400 border-b border-slate-200 dark:border-white/10">
                        <th className="p-4 font-semibold w-[35%]">Applicant</th>
                        <th className="p-4 font-semibold w-[20%]">Date Submitted</th>
                        <th className="p-4 font-semibold w-[15%]">Status</th>
                        <th className="p-4 font-semibold w-[30%] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applicants.map((app) => {
                            const isUserDeleted = !validUserIds.has(app.userId);
                            
                            return (
                            <tr 
                                key={app.id} 
                                className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                            >
                                <td 
                                    className="p-4 font-medium text-slate-900 dark:text-white flex items-center gap-3 w-[35%] overflow-hidden"
                                    onClick={() => setSelectedApp(app)}
                                >
                                    <div className="w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center font-bold text-xs shrink-0">
                                    {app.applicantName.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="group-hover:text-accent-blue transition-colors underline decoration-dotted decoration-slate-400 underline-offset-4 whitespace-normal break-words">
                                            {app.applicantName}
                                        </span>
                                        {isUserDeleted && (
                                            <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold border border-red-200 dark:border-red-800 w-fit">
                                                Deleted Account
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 text-slate-500 dark:text-gray-400 text-sm w-[20%]" onClick={() => setSelectedApp(app)}>{app.dateApplied}</td>
                                <td className="p-4 w-[15%]" onClick={() => setSelectedApp(app)}>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(app.status)}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right w-[30%]" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex justify-end gap-2 items-center">
                                    {/* Action Buttons Row */}
                                    {app.status !== 'Accepted' && app.status !== 'Rejected' && !isUserDeleted && (
                                        <>
                                            {app.status === 'Applied' && (
                                                <button 
                                                    onClick={() => initiateStatusChange(app.id, 'Under Review')}
                                                    className="p-2 rounded-lg text-yellow-500 hover:bg-yellow-500/10 transition-colors" 
                                                    title="Mark Under Review"
                                                >
                                                    <Clock size={18} />
                                                </button>
                                            )}
                                            {app.status === 'Under Review' && (
                                                <button 
                                                    onClick={() => initiateStatusChange(app.id, 'Exam')}
                                                    className="p-2 rounded-lg text-purple-500 hover:bg-purple-500/10 transition-colors" 
                                                    title="Schedule Exam"
                                                >
                                                    <PenTool size={18} />
                                                </button>
                                            )}
                                            {app.status === 'Exam' && (
                                                <button 
                                                    onClick={() => initiateStatusChange(app.id, 'Interview')}
                                                    className="p-2 rounded-lg text-orange-500 hover:bg-orange-500/10 transition-colors" 
                                                    title="Schedule Interview"
                                                >
                                                    <MessageSquare size={18} />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => initiateStatusChange(app.id, 'Accepted')}
                                                className="p-2 rounded-lg text-slate-400 hover:bg-green-500/10 hover:text-green-600 transition-colors" 
                                                title="Approve"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button 
                                                onClick={() => initiateStatusChange(app.id, 'Rejected')}
                                                className="p-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-600 transition-colors" 
                                                title="Reject"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </>
                                    )}
                                    { (app.status === 'Accepted' || app.status === 'Rejected') && (
                                        <span className="text-xs text-slate-400 italic py-2 mr-2">Processed</span>
                                    )}
                                    {/* Delete Button */}
                                    <button 
                                        onClick={(e) => handleDeleteApplication(e, app.id)}
                                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-600 transition-colors"
                                        title="Delete Application"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    </div>
                                </td>
                            </tr>
                            )
                        })}
                    </tbody>
                    </table>
                </div>
                )}
            </GlassCard>
            )})
        ) : (
            <div className="text-center py-20 text-slate-500 dark:text-gray-400">
                <AlertCircle size={40} className="mx-auto mb-4 opacity-50" />
                No applications found in the system.
            </div>
        )}
      </div>

      {/* Applicant Detail Modal */}
      {selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="w-full max-w-4xl bg-white dark:bg-navy-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 flex flex-col max-h-[90vh]">
                  
                  {/* Header */}
                  <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-start bg-slate-50 dark:bg-white/5">
                      <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center font-bold text-2xl">
                              {selectedApp.applicantName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                {selectedApp.applicantName}
                                {!validUserIds.has(selectedApp.userId) && (
                                    <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-red-800">
                                        Deleted Account
                                    </span>
                                )}
                              </h2>
                              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-gray-400 mt-1">
                                  <span className="flex items-center gap-1"><Mail size={14} /> {selectedApp.applicantEmail}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                  <span>ID: #{selectedApp.id}</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                  {selectedApp.applicantProfile?.location && (
                                     <span className="text-xs flex items-center gap-1 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-slate-600 dark:text-gray-300">
                                         <MapPin size={12} /> {selectedApp.applicantProfile.location}
                                     </span>
                                  )}
                                  {selectedApp.applicantProfile?.age && (
                                     <span className="text-xs flex items-center gap-1 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-slate-600 dark:text-gray-300">
                                         Age: {selectedApp.applicantProfile.age}
                                     </span>
                                  )}
                                  {selectedApp.applicantProfile?.gender && (
                                     <span className="text-xs flex items-center gap-1 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-slate-600 dark:text-gray-300">
                                         {selectedApp.applicantProfile.gender}
                                     </span>
                                  )}
                              </div>
                          </div>
                      </div>
                      <button onClick={() => setSelectedApp(null)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500">
                          <X size={24} />
                      </button>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto p-8">
                      <div className="grid md:grid-cols-3 gap-8">
                          
                          {/* Column 1: Applicant Profile */}
                          <div className="md:col-span-1 border-r border-slate-200 dark:border-white/10 pr-6">
                              <h3 className="font-bold text-sm uppercase text-accent-blue tracking-wider mb-4 flex items-center gap-2">
                                 <User size={16} /> Personal Info
                              </h3>
                              <div className="space-y-4">
                                  {selectedApp.applicantProfile ? (
                                    <>
                                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                            <p className="text-xs text-slate-500 mb-1">Full Name</p>
                                            <p className="font-semibold text-sm text-slate-900 dark:text-white">
                                                {selectedApp.applicantProfile.firstName} {selectedApp.applicantProfile.middleName} {selectedApp.applicantProfile.lastName}
                                            </p>
                                        </div>
                                        
                                        {/* Guardian Info */}
                                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                            <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><HeartHandshake size={12} /> Guardian</p>
                                            <p className="font-semibold text-sm text-slate-900 dark:text-white">{selectedApp.applicantProfile.guardianName || 'N/A'}</p>
                                            <p className="text-xs text-slate-600 dark:text-gray-400">{selectedApp.applicantProfile.guardianRelationship}</p>
                                            <p className="text-xs text-slate-600 dark:text-gray-400">{selectedApp.applicantProfile.guardianContact}</p>
                                        </div>

                                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                            <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><GraduationCap size={12} /> Education</p>
                                            <p className="font-semibold text-sm text-slate-900 dark:text-white">{selectedApp.applicantProfile.educationLevel}</p>
                                            <p className="text-xs text-slate-600 dark:text-gray-400">{selectedApp.applicantProfile.schoolName}</p>
                                            <p className="text-xs text-slate-600 dark:text-gray-400">{selectedApp.applicantProfile.major}</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                            <p className="text-xs text-slate-500 mb-1">GWA / GPA</p>
                                            <p className="font-bold text-lg text-accent-blue">{selectedApp.applicantProfile.gpa || "N/A"}</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                            <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><DollarSign size={12} /> Financial Info</p>
                                            <p className="font-semibold text-sm text-slate-900 dark:text-white">{selectedApp.applicantProfile.incomeRange}</p>
                                            <p className="text-xs text-slate-600 dark:text-gray-400">Household: {selectedApp.applicantProfile.householdSize} members</p>
                                            {selectedApp.applicantProfile.isWorkingStudent && (
                                                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px] font-bold">Working Student</span>
                                            )}
                                        </div>
                                    </>
                                  ) : (
                                    <p className="text-sm italic text-slate-500">Profile data snapshot unavailable.</p>
                                  )}
                              </div>
                          </div>

                          {/* Column 2 & 3: Application Info & Documents */}
                          <div className="md:col-span-2">
                              <div className="grid md:grid-cols-2 gap-8 mb-8">
                                  <div>
                                      <h3 className="font-bold text-sm uppercase text-slate-400 tracking-wider mb-4">Application Info</h3>
                                      <div className="space-y-4">
                                          <div>
                                              <p className="text-xs text-slate-500">Applying For</p>
                                              <p className="font-semibold text-slate-900 dark:text-white">{selectedApp.scholarshipTitle}</p>
                                          </div>
                                          <div>
                                              <p className="text-xs text-slate-500">Sponsor</p>
                                              <p className="font-semibold text-slate-900 dark:text-white">{selectedApp.sponsor}</p>
                                          </div>
                                          <div>
                                              <p className="text-xs text-slate-500">Date Applied</p>
                                              <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                                  <Calendar size={16} /> {selectedApp.dateApplied}
                                              </p>
                                          </div>
                                          <div>
                                              <p className="text-xs text-slate-500">Current Status</p>
                                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${getStatusColor(selectedApp.status)}`}>
                                                  {selectedApp.status}
                                              </span>
                                          </div>
                                      </div>
                                  </div>

                                  <div>
                                      <h3 className="font-bold text-sm uppercase text-slate-400 tracking-wider mb-4">Documents</h3>
                                      <div className="space-y-3">
                                          {selectedApp.documents && selectedApp.documents.length > 0 ? (
                                              selectedApp.documents.map((doc, idx) => (
                                                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 hover:border-accent-blue/50 transition-colors group cursor-pointer">
                                                      <div className="p-2 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded">
                                                          <FileText size={18} />
                                                      </div>
                                                      <div className="flex-1 min-w-0">
                                                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{doc.name}</p>
                                                          <p className="text-xs text-slate-500">{doc.size} • {doc.type}</p>
                                                      </div>
                                                      <button className="p-2 text-slate-400 hover:text-accent-blue opacity-0 group-hover:opacity-100 transition-opacity">
                                                          <Download size={18} />
                                                      </button>
                                                  </div>
                                              ))
                                          ) : (
                                              <div className="text-sm text-slate-500 italic p-4 bg-slate-50 dark:bg-white/5 rounded-lg text-center">
                                                  No documents attached.
                                              </div>
                                  )}
                                  </div>
                                  </div>
                              </div>
                              
                              <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                                  <h3 className="font-bold text-sm uppercase text-slate-400 tracking-wider mb-2">Remarks / Notes</h3>
                                  <p className="text-slate-700 dark:text-gray-300">
                                     {selectedApp.remarks || "No remarks added for this application."}
                                  </p>
                                  {selectedApp.adminMessage && (
                                     <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
                                        <h4 className="text-xs font-bold text-accent-blue uppercase mb-2 flex items-center gap-1">
                                            <Mail size={12} /> Last Sent Email
                                        </h4>
                                        <p className="text-sm text-slate-600 dark:text-gray-400 italic whitespace-pre-wrap bg-white dark:bg-navy-900 p-3 rounded-lg border border-slate-200 dark:border-white/10">
                                            {selectedApp.adminMessage}
                                        </p>
                                     </div>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-navy-900 flex justify-end gap-3">
                      <Button variant="ghost" onClick={() => setSelectedApp(null)}>Close</Button>
                      
                      {selectedApp.status !== 'Accepted' && selectedApp.status !== 'Rejected' && validUserIds.has(selectedApp.userId) && (
                          <>
                             {selectedApp.status === 'Applied' && (
                                <Button 
                                    className="bg-yellow-500 text-white hover:bg-yellow-600"
                                    onClick={() => initiateStatusChange(selectedApp.id, 'Under Review')}
                                >
                                    Review
                                </Button>
                             )}
                             {selectedApp.status === 'Under Review' && (
                                <Button 
                                    className="bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-500/20"
                                    onClick={() => initiateStatusChange(selectedApp.id, 'Exam')}
                                    icon={<PenTool size={16} />}
                                >
                                    Schedule Exam
                                </Button>
                             )}
                             {selectedApp.status === 'Exam' && (
                                <Button 
                                    className="bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20"
                                    onClick={() => initiateStatusChange(selectedApp.id, 'Interview')}
                                    icon={<MessageSquare size={16} />}
                                >
                                    Schedule Interview
                                </Button>
                             )}
                             
                             <Button 
                                className="bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
                                onClick={() => initiateStatusChange(selectedApp.id, 'Rejected')}
                             >
                                Reject
                             </Button>
                             <Button 
                                className="bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/20"
                                onClick={() => initiateStatusChange(selectedApp.id, 'Accepted')}
                             >
                                Approve
                             </Button>
                          </>
                      )}
                      {!validUserIds.has(selectedApp.userId) && (
                          <p className="text-red-500 text-sm italic self-center px-4">Actions unavailable for deleted accounts.</p>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* SEND EMAIL / UPDATE STATUS MODAL */}
      {statusModal.isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
             <div className="w-full max-w-lg bg-white dark:bg-navy-900 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10">
                <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Mail size={20} className="text-accent-blue" />
                        Send Update Email
                    </h3>
                    <button onClick={() => setStatusModal({ ...statusModal, isOpen: false })} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6">
                    <p className="text-sm text-slate-600 dark:text-gray-300 mb-4">
                        You are about to change the status to <span className="font-bold text-accent-blue">{statusModal.newStatus}</span>. 
                        Customize the email notification sent to the applicant below.
                    </p>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-500">Email Message</label>
                        <textarea 
                            value={adminMessage}
                            onChange={(e) => setAdminMessage(e.target.value)}
                            className="w-full h-40 glass-input p-4 rounded-xl text-sm dark:text-white font-medium resize-none focus:ring-2 focus:ring-accent-blue/50"
                            placeholder="Enter instructions, dates, or details here..."
                        ></textarea>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/5 flex justify-end gap-3 border-t border-slate-200 dark:border-white/10">
                    <Button variant="ghost" onClick={() => setStatusModal({ ...statusModal, isOpen: false })}>Cancel</Button>
                    <Button variant="primary" onClick={confirmStatusChange} icon={<Send size={16} />}>
                        Send & Update Status
                    </Button>
                </div>
             </div>
          </div>
      )}
    </div>
  );
};

export default AdminApplications;
