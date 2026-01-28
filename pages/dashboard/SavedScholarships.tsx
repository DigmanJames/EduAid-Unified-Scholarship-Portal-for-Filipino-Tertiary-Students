
import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Award, Calendar, Sparkles, ExternalLink } from 'lucide-react';
import ScholarshipCard, { getScholarshipIcon } from '../../components/ScholarshipCard';
import ApplicationModal from '../../components/ApplicationModal';
import Button from '../../components/Button';
import { useScholarships } from '../../context/ScholarshipContext';
import { Scholarship } from '../../types';

const SavedScholarships: React.FC = () => {
  const { scholarships, savedIds, isSaved, toggleSave } = useScholarships();
  
  const savedList = scholarships.filter(s => savedIds.includes(s.id));

  // Modals State
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [applicationScholarship, setApplicationScholarship] = useState<Scholarship | null>(null);

  const handleApply = (scholarship: Scholarship) => {
    setApplicationScholarship(scholarship);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Saved Scholarships</h1>
        <span className="text-slate-500 dark:text-gray-400 text-sm">{savedList.length} Saved Items</span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedList.length > 0 ? (
          savedList.map(s => (
            <ScholarshipCard 
              key={s.id} 
              data={s} 
              showMatch={true}
              isSaved={isSaved(s.id)}
              onToggleSave={toggleSave}
              onClick={() => setSelectedScholarship(s)}
              onApply={handleApply}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg text-slate-500 dark:text-gray-400">You haven't saved any scholarships yet.</p>
            <p className="text-sm text-slate-400 dark:text-gray-500">Browse scholarships and click the heart icon to save them here.</p>
          </div>
        )}
      </div>

      {/* Application Wizard Modal */}
      <ApplicationModal 
        isOpen={!!applicationScholarship}
        scholarship={applicationScholarship}
        onClose={() => setApplicationScholarship(null)}
      />

      {/* Scholarship Detail Modal */}
      {selectedScholarship && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-300">
           {/* Modal Container */}
           <div 
             className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-navy-900 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10 relative"
             onClick={(e) => e.stopPropagation()}
           >
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedScholarship(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white dark:bg-navy-800 text-slate-900 dark:text-white shadow-lg border border-slate-100 dark:border-white/10 hover:scale-110 transition-transform"
              >
                <X size={20} />
              </button>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                 {/* Decorative Header */}
                 <div className="h-40 bg-gradient-to-br from-accent-blue via-indigo-600 to-accent-violet relative shrink-0">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                 </div>

                 <div className="px-8 pb-8">
                     {/* Header Section with Icon overlap */}
                     <div className="flex flex-col sm:flex-row gap-6 -mt-16 mb-8 relative z-10">
                        {/* Logo Box */}
                        <div className="w-28 h-28 rounded-3xl bg-white dark:bg-navy-800 shadow-xl border-4 border-white dark:border-navy-900 flex items-center justify-center text-accent-blue dark:text-accent-cyan overflow-hidden shrink-0">
                             {React.cloneElement(getScholarshipIcon(selectedScholarship.category, selectedScholarship.title), { size: 56 })}
                        </div>
                        
                        {/* Title & Organization */}
                        <div className="pt-2 sm:pt-16">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
                               {selectedScholarship.title}
                            </h2>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className="flex items-center gap-1.5 font-semibold text-accent-blue bg-accent-blue/10 px-3 py-1 rounded-full border border-accent-blue/20">
                                   <ShieldCheck size={16} /> {selectedScholarship.sponsor}
                                </span>
                                <span className="flex items-center gap-1.5 text-slate-500 dark:text-gray-400">
                                   <MapPin size={16} /> {selectedScholarship.location || "National"}
                                </span>
                            </div>
                        </div>
                     </div>

                     {/* Key Info Cards */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center gap-4">
                           <div className="p-3 rounded-xl bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400">
                              <Award size={24} />
                           </div>
                           <div>
                             <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Benefit Amount</span>
                             <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{selectedScholarship.amount}</p>
                           </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center gap-4">
                           <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
                              <Calendar size={24} />
                           </div>
                           <div>
                             <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Deadline</span>
                             <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{selectedScholarship.deadline}</p>
                           </div>
                        </div>
                     </div>

                     {/* Main Description */}
                     <div className="space-y-8">
                        <div>
                           <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">About the Scholarship</h3>
                           <p className="text-slate-600 dark:text-gray-300 leading-relaxed text-base">
                              {selectedScholarship.description}
                           </p>
                        </div>

                        {/* Requirements / Eligibility Grid */}
                        <div className="grid md:grid-cols-2 gap-8 p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                           <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-accent-blue"></div> Eligibility
                              </h4>
                              <ul className="space-y-3">
                                 {selectedScholarship.eligibility && selectedScholarship.eligibility.length > 0 ? (
                                    selectedScholarship.eligibility.map((item, index) => (
                                      <li key={index} className="flex gap-3 text-sm text-slate-600 dark:text-gray-300">
                                         <ShieldCheck size={16} className="text-accent-blue shrink-0 mt-0.5" />
                                         {item}
                                      </li>
                                    ))
                                 ) : (
                                    <li className="text-sm text-slate-500 italic">No specific eligibility listed.</li>
                                 )}
                              </ul>
                           </div>
                           <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-accent-violet"></div> Requirements
                              </h4>
                              <ul className="space-y-3">
                                 {selectedScholarship.requirements && selectedScholarship.requirements.length > 0 ? (
                                    selectedScholarship.requirements.map((item, index) => (
                                      <li key={index} className="flex gap-3 text-sm text-slate-600 dark:text-gray-300">
                                         <Sparkles size={16} className="text-accent-violet shrink-0 mt-0.5" />
                                         {item}
                                      </li>
                                    ))
                                 ) : (
                                    <li className="text-sm text-slate-500 italic">No specific requirements listed.</li>
                                 )}
                              </ul>
                           </div>
                        </div>
                     </div>
                 </div>
              </div>

              {/* Sticky Footer */}
              <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-white/80 dark:bg-navy-900/90 backdrop-blur-md flex gap-4 shrink-0 z-20">
                  <Button 
                     variant="outline" 
                     className="flex-1 py-4 text-base h-12" 
                     onClick={() => selectedScholarship.websiteUrl && window.open(selectedScholarship.websiteUrl, '_blank')}
                  >
                     Visit Website
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-1 py-4 text-base h-12 shadow-xl shadow-accent-blue/20 hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => {
                        setSelectedScholarship(null); // Close detail modal
                        setApplicationScholarship(selectedScholarship); // Open Apply modal
                    }}
                  >
                     Apply Now <ExternalLink size={18} className="ml-2" />
                  </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SavedScholarships;
