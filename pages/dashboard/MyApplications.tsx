
import React, { useState, useEffect } from 'react';
import GlassCard from '../../components/GlassCard';
import { Application, TimelineEvent } from '../../types';
import { Eye, CheckCircle, Clock, XCircle, Calendar, FileText, X, Mail } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useLocation } from 'react-router-dom';

const getStatusColor = (status: string) => {
  switch(status) {
    case 'Accepted': return 'bg-green-500/20 text-green-600 dark:text-green-400';
    case 'Rejected': return 'bg-red-500/20 text-red-600 dark:text-red-400';
    case 'Exam': return 'bg-purple-500/20 text-purple-600 dark:text-purple-400';
    case 'Interview': return 'bg-orange-500/20 text-orange-600 dark:text-orange-400';
    case 'Under Review': return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
    default: return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
  }
};

const MyApplications: React.FC = () => {
  const { applications } = useUser();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  
  // Handling navigation from Notifications
  const location = useLocation();

  useEffect(() => {
    // Check if there is an app ID passed via navigation state
    if (location.state && location.state.openAppId) {
        const appToOpen = applications.find(a => a.id === location.state.openAppId);
        if (appToOpen) {
            setSelectedApp(appToOpen);
        }
        // Clear state to prevent reopening on simple refresh (optional but good UX)
        window.history.replaceState({}, document.title);
    }
  }, [location, applications]);

  const renderTimeline = (app: Application) => {
    const history = app.history || [];
    
    // Helper to find event in history
    const getEvent = (status: string): TimelineEvent | undefined => {
        return history.find(h => h.status === status);
    };

    // Define Stages
    const stages = [
      { label: 'Submitted', status: 'Applied', placeholder: app.dateApplied },
      { label: 'Under Review', status: 'Under Review', placeholder: 'Processing' },
      { label: 'Qualifying Exam', status: 'Exam', placeholder: 'TBA' },
      { label: 'Interview', status: 'Interview', placeholder: 'TBA' },
      { label: 'Final Decision', status: ['Accepted', 'Rejected'], placeholder: 'Results' }
    ];

    return (
      <div className="relative pl-8 border-l-2 border-slate-200 dark:border-white/10 space-y-8 my-6">
        {stages.map((stage, index) => {
            // Check if this stage has happened
            let event: TimelineEvent | undefined;
            if (Array.isArray(stage.status)) {
                event = history.find(h => stage.status.includes(h.status));
            } else {
                event = getEvent(stage.status as string);
            }

            // Special handling for "Submitted" which is always true if app exists
            if (stage.status === 'Applied' && !event) {
                event = { status: 'Applied', date: app.dateApplied };
            }

            const isCompleted = !!event;
            // If final decision, check specifically which one for color
            let isRejected = false;
            if (index === stages.length - 1 && event?.status === 'Rejected') {
                isRejected = true;
            }

            return (
            <div key={index} className="relative group">
                <div className={`absolute -left-[41px] w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white dark:bg-navy-900 transition-colors duration-300
                    ${isCompleted 
                        ? isRejected ? 'border-red-500 text-red-500' : 'border-accent-blue text-accent-blue' 
                        : 'border-slate-300 dark:border-gray-600 text-slate-300'
                    }
                `}>
                {isCompleted && <div className={`w-2.5 h-2.5 rounded-full ${isRejected ? 'bg-red-500' : 'bg-accent-blue'}`}></div>}
                </div>
                <div>
                <h4 className={`font-bold ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-gray-500'}`}>
                    {stage.label} {isCompleted && isRejected && '(Rejected)'} {isCompleted && event?.status === 'Accepted' && '(Accepted)'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                    {isCompleted ? event?.date : stage.placeholder}
                </p>
                
                {/* Show message if available for this specific step */}
                {isCompleted && event?.message && (
                    <div className="mt-2 p-2 bg-slate-50 dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-gray-300 italic">
                        "{event.message}"
                    </div>
                )}
                </div>
            </div>
            );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">My Applications</h1>
      
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/50 dark:bg-white/5 text-sm text-slate-500 dark:text-gray-400 border-b border-slate-200 dark:border-white/10">
                <th className="p-4 font-semibold">Scholarship</th>
                <th className="p-4 font-semibold hidden md:table-cell">Sponsor</th>
                <th className="p-4 font-semibold">Date Applied</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr 
                    key={app.id} 
                    onClick={() => setSelectedApp(app)}
                    className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white group-hover:text-accent-blue transition-colors">{app.scholarshipTitle}</p>
                      <p className="text-xs text-slate-500 md:hidden">{app.sponsor}</p>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-gray-300 hidden md:table-cell">{app.sponsor}</td>
                    <td className="p-4 text-slate-600 dark:text-gray-300 text-sm">{app.dateApplied}</td>
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 rounded-full text-slate-400 hover:bg-accent-blue/10 hover:text-accent-blue transition-colors">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-gray-400">
                    You haven't applied to any scholarships yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Progress / Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
           <div className="w-full max-w-lg bg-white dark:bg-navy-900 rounded-2xl shadow-2xl animate-[fadeIn_0.3s_ease-out] overflow-hidden border border-slate-200 dark:border-white/10 max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-start bg-slate-50 dark:bg-white/5">
                 <div>
                   <h2 className="text-xl font-bold text-slate-900 dark:text-white pr-4">{selectedApp.scholarshipTitle}</h2>
                   <p className="text-sm text-slate-500 dark:text-gray-400">{selectedApp.sponsor}</p>
                 </div>
                 <button onClick={() => setSelectedApp(null)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-gray-400">
                   <X size={24} />
                 </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-8 overflow-y-auto">
                 <div className="flex items-center gap-3 mb-8">
                    <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${getStatusColor(selectedApp.status)}`}>
                       {selectedApp.status}
                    </div>
                    <span className="text-sm text-slate-400 flex items-center gap-1">
                       <Calendar size={14} /> Applied {selectedApp.dateApplied}
                    </span>
                 </div>

                 {/* Admin Message Section - Shows up if admin sent an update */}
                 {selectedApp.adminMessage && (
                     <div className="mb-8 p-4 bg-accent-blue/5 border border-accent-blue/20 rounded-xl relative">
                        <div className="absolute -top-3 left-4 px-2 bg-white dark:bg-navy-900 text-xs font-bold text-accent-blue flex items-center gap-1">
                             <Mail size={12} /> Latest Update
                        </div>
                        <p className="text-sm text-slate-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                            {selectedApp.adminMessage}
                        </p>
                     </div>
                 )}
                 
                 <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4">Application Timeline</h3>
                 {renderTimeline(selectedApp)}

                 <div className="mt-8 p-4 bg-slate-100 dark:bg-white/5 rounded-xl">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                      <FileText size={16} /> Current Remarks
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-gray-300">
                      {selectedApp.remarks || "No remarks available."}
                    </p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
