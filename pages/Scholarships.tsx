
import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2, X, MapPin, Calendar, ShieldCheck, Share2, ExternalLink, Award, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import ScholarshipCard, { getScholarshipIcon } from '../components/ScholarshipCard';
import ApplicationModal from '../components/ApplicationModal';
import { useScholarships } from '../context/ScholarshipContext';
import { Scholarship } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Scholarships: React.FC = () => {
  const { scholarships: allScholarships, isSaved, toggleSave } = useScholarships();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [displayedScholarships, setDisplayedScholarships] = useState(allScholarships);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Detail Modal State
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  // Application Modal State
  const [applicationScholarship, setApplicationScholarship] = useState<Scholarship | null>(null);

  // Filter Logic (Simple text filter)
  useEffect(() => {
    if (!searchQuery) {
      setDisplayedScholarships(allScholarships);
      return;
    }
    
    const lowerQ = searchQuery.toLowerCase();
    const filtered = allScholarships.filter(s => 
      s.title.toLowerCase().includes(lowerQ) || 
      s.sponsor.toLowerCase().includes(lowerQ) ||
      s.tags.some(t => t.toLowerCase().includes(lowerQ))
    );
    setDisplayedScholarships(filtered);
  }, [searchQuery, allScholarships]);

  const handleApply = (scholarship: Scholarship) => {
     if (!currentUser) {
        // Redirect to login if not authenticated
        navigate('/login');
        return;
     }
     setApplicationScholarship(scholarship);
  };

  return (
    <div className="pt-24 min-h-screen pb-20 px-4 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Browse Scholarships</h1>
        <p className="text-slate-600 dark:text-gray-400">Explore over 500+ verified financial aid opportunities in the Philippines.</p>
      </div>

      {/* Search & Filter Bar */}
      <GlassCard className="mb-10 p-1 sticky top-24 z-30 bg-white/80 dark:bg-navy-900/80 backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row gap-2 p-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, course, or describe yourself..."
              className="w-full glass-input rounded-lg pl-10 pr-4 py-3 text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="hidden md:flex" icon={<Filter size={18} />}>
            Filters
          </Button>
        </div>
      </GlassCard>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedScholarships.length > 0 ? (
          displayedScholarships.map((scholarship) => (
            <ScholarshipCard 
              key={scholarship.id} 
              data={scholarship} 
              isSaved={isSaved(scholarship.id)}
              onToggleSave={toggleSave}
              onClick={() => setSelectedScholarship(scholarship)}
              onApply={handleApply}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500">
            No scholarships found. Try a different search term.
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
              
              {/* Close Button - Floating & High Visibility */}
              <button 
                onClick={() => setSelectedScholarship(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white dark:bg-navy-800 text-slate-900 dark:text-white shadow-lg border border-slate-100 dark:border-white/10 hover:scale-110 transition-transform"
              >
                <X size={20} />
              </button>
              
              {/* Scrollable Content (Header moved inside to fix clipping) */}
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
                        handleApply(selectedScholarship); // Use new handler with auth check
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

export default Scholarships;
