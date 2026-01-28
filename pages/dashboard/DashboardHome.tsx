
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Heart, Share2, ExternalLink, Award, Map, ShieldCheck, Calendar, Atom, Palette, BookOpen, GraduationCap, HandCoins, ArrowLeft } from 'lucide-react';
import Button from '../../components/Button';
import ScholarshipCard, { getScholarshipIcon } from '../../components/ScholarshipCard';
import ApplicationModal from '../../components/ApplicationModal';
import { useScholarships } from '../../context/ScholarshipContext';
import { Scholarship } from '../../types';

const DashboardHome: React.FC = () => {
  const { scholarships, isSaved, toggleSave } = useScholarships();
  const [filteredScholarships, setFilteredScholarships] = useState(scholarships);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  
  // Application Modal State
  const [applicationScholarship, setApplicationScholarship] = useState<Scholarship | null>(null);

  // Search State
  const [whatQuery, setWhatQuery] = useState('');
  const [whereQuery, setWhereQuery] = useState('');

  // Filter logic
  useEffect(() => {
    const lowerWhat = whatQuery.toLowerCase().trim();
    const lowerWhere = whereQuery.toLowerCase().trim();

    const results = scholarships.filter(s => {
      const matchWhat = !lowerWhat || 
        s.title.toLowerCase().includes(lowerWhat) ||
        s.sponsor.toLowerCase().includes(lowerWhat) ||
        s.tags.some(t => t.toLowerCase().includes(lowerWhat));

      const matchWhere = !lowerWhere ||
        (s.location && s.location.toLowerCase().includes(lowerWhere));

      return matchWhat && matchWhere;
    });

    setFilteredScholarships(results);
  }, [whatQuery, whereQuery, scholarships]);

  // Update filtered list when main list changes (e.g. added new)
  useEffect(() => {
      setFilteredScholarships(scholarships);
  }, [scholarships]);

  // Select first item by default on Desktop only, if nothing selected
  useEffect(() => {
      if (!selectedId && filteredScholarships.length > 0 && window.innerWidth >= 1024) {
          // Only auto-select on desktop to prevent mobile issues
      }
  }, [filteredScholarships, selectedId]);

  const selectedScholarship = filteredScholarships.find(s => s.id === selectedId) || (filteredScholarships.length > 0 ? filteredScholarships[0] : null);
  const isSelectedSaved = selectedScholarship ? isSaved(selectedScholarship.id) : false;

  const handleCardClick = (id: string) => {
      setSelectedId(id);
      setShowMobileDetail(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-slate-50 dark:bg-navy-950/50"> {/* 5rem is header height */}
      
      {/* Modern Glass Search Header - Hidden on Mobile Detail View */}
      <div className={`px-6 py-4 shrink-0 z-20 ${showMobileDetail ? 'hidden lg:block' : 'block'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-navy-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-black/20">
             <div className="flex flex-col md:flex-row gap-4 items-center">
                
                {/* Search Inputs Group */}
                <div className="flex-1 flex flex-col md:flex-row w-full border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-white/10">
                   {/* What Input */}
                   <div className="flex-1 relative bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors group">
                      <div className="absolute top-2.5 left-12 text-[10px] font-bold text-slate-400 uppercase tracking-wider">What</div>
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-blue" size={20} />
                      <input 
                        type="text" 
                        placeholder="Scholarship title, keyword, or sponsor" 
                        className="w-full h-14 pl-12 pr-4 pt-4 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm font-medium"
                        value={whatQuery}
                        onChange={(e) => setWhatQuery(e.target.value)}
                      />
                   </div>

                   {/* Where Input */}
                   <div className="flex-1 relative bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors group">
                      <div className="absolute top-2.5 left-12 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Where</div>
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-violet" size={20} />
                      <input 
                        type="text" 
                        placeholder="City, province, or region" 
                        className="w-full h-14 pl-12 pr-4 pt-4 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm font-medium"
                        value={whereQuery}
                        onChange={(e) => setWhereQuery(e.target.value)}
                      />
                   </div>
                </div>

                {/* Action Button */}
                <Button variant="primary" className="h-14 px-8 rounded-xl w-full md:w-auto font-bold shadow-lg shadow-accent-blue/25 hover:shadow-accent-blue/40">
                   Find Matches
                </Button>
             </div>

             {/* Quick Filters */}
             <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                {['Full Scholarship', 'Merit Based', 'Needs Based', 'Government', 'STEM'].map((filter, i) => (
                   <button 
                      key={i} 
                      onClick={() => setWhatQuery(filter)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:bg-accent-blue/10 hover:text-accent-blue dark:hover:bg-white/10 transition-colors border border-transparent hover:border-accent-blue/30"
                   >
                      {filter}
                   </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Main Content: Master-Detail Layout */}
      <div className="flex-1 overflow-hidden relative">
        <div className="max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 px-0 lg:px-6 pb-6 relative">
           
           {/* Left Column: Feed (List) */}
           {/* Hidden on mobile if detail is shown */}
           <div className={`lg:col-span-5 h-full flex flex-col overflow-hidden ${showMobileDetail ? 'hidden lg:flex' : 'flex'}`}>
              <div className="flex items-center justify-between mb-3 px-4 lg:px-0 shrink-0">
                <h2 className="text-slate-900 dark:text-white font-bold text-lg">
                  {filteredScholarships.length} Recommendations
                </h2>
                <span className="text-xs font-medium text-slate-500 dark:text-gray-400">
                   Sorted by relevance
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 lg:p-1 space-y-3 pb-20">
                  {filteredScholarships.length > 0 ? (
                    filteredScholarships.map((scholarship) => (
                      <ScholarshipCard 
                        key={scholarship.id} 
                        data={scholarship} 
                        variant="list" 
                        compact 
                        isSelected={selectedId === scholarship.id || (!selectedId && selectedScholarship?.id === scholarship.id)}
                        onClick={() => handleCardClick(scholarship.id)}
                        isSaved={isSaved(scholarship.id)}
                        onToggleSave={toggleSave}
                        onApply={(s) => setApplicationScholarship(s)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-500 dark:text-gray-400">
                      No scholarships match your search.
                    </div>
                  )}
                  <div className="h-10"></div>
              </div>
           </div>

           {/* Right Column: Detail Pane (Sticky) */}
           {/* Visible on Desktop. On Mobile, acts as full overlay if showMobileDetail is true */}
           <div className={`
              lg:block lg:col-span-7 h-full overflow-hidden 
              ${showMobileDetail ? 'fixed inset-0 z-50 bg-slate-50 dark:bg-navy-950 lg:static lg:bg-transparent' : 'hidden'}
           `}>
              <div className="h-full bg-white dark:bg-navy-900 lg:rounded-2xl border-none lg:border border-slate-200 dark:border-white/10 shadow-none lg:shadow-2xl lg:shadow-slate-200/50 dark:lg:shadow-black/40 overflow-y-auto relative flex flex-col">
                  
                  {selectedScholarship ? (
                    <div className="flex flex-col min-h-full animate-in slide-in-from-right-10 lg:animate-none">
                       {/* Abstract Gradient Header - No Photo */}
                       <div className="h-32 bg-gradient-to-br from-accent-blue via-indigo-600 to-accent-violet relative shrink-0">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                          
                          {/* Mobile Back Button */}
                          <div className="absolute top-4 left-4 lg:hidden">
                             <button 
                               onClick={() => setShowMobileDetail(false)}
                               className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all flex items-center gap-2"
                             >
                                <ArrowLeft size={18} /> <span className="text-xs font-bold">Back</span>
                             </button>
                          </div>

                          {/* Top Actions */}
                          <div className="absolute top-4 right-4 flex gap-3">
                               <button className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white transition-all shadow-sm">
                                 <Share2 size={18} />
                               </button>
                               <button 
                                 onClick={() => toggleSave(selectedScholarship.id)}
                                 className={`p-2.5 rounded-xl backdrop-blur-md border transition-all shadow-sm ${isSelectedSaved ? 'bg-white text-red-500 border-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
                               >
                                 <Heart size={18} fill={isSelectedSaved ? "currentColor" : "none"} />
                               </button>
                          </div>
                       </div>
                       
                       <div className="px-8 pb-8 flex-1">
                          {/* Header Content with overlap */}
                          <div className="flex flex-col items-start -mt-12 mb-6 relative z-10">
                             <div className="w-24 h-24 rounded-2xl bg-white dark:bg-navy-800 shadow-xl border-4 border-white dark:border-navy-900 flex items-center justify-center text-accent-blue dark:text-accent-cyan overflow-hidden">
                                {React.cloneElement(getScholarshipIcon(selectedScholarship.category, selectedScholarship.title), { size: 48 })}
                             </div>
                          </div>

                          {/* Title Area */}
                          <div className="mb-8">
                             <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                               {selectedScholarship.title}
                             </h1>
                             <div className="flex items-center gap-2 text-accent-blue font-semibold mb-4">
                               <ShieldCheck size={18} />
                               <span>{selectedScholarship.sponsor}</span>
                             </div>

                             <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-gray-400 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                                <div className="flex items-center gap-2">
                                   <MapPin size={16} className="text-slate-400" /> 
                                   {selectedScholarship.location || "National"}
                                </div>
                                <div className="w-px h-4 bg-slate-300 dark:bg-white/10"></div>
                                <div className="flex items-center gap-2">
                                   <Award size={16} className="text-slate-400" /> 
                                   {selectedScholarship.amount}
                                </div>
                                <div className="w-px h-4 bg-slate-300 dark:bg-white/10"></div>
                                <div className="flex items-center gap-2">
                                   <Calendar size={16} className="text-slate-400" /> 
                                   Deadline: {selectedScholarship.deadline}
                                </div>
                             </div>
                          </div>

                          {/* Body Content */}
                          <div className="prose prose-slate dark:prose-invert max-w-none">
                             <h3 className="text-lg font-bold mb-3">About the Opportunity</h3>
                             <p className="text-slate-600 dark:text-gray-300 leading-relaxed mb-6">
                               {selectedScholarship.description}
                             </p>
                             
                             <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div>
                                  <h4 className="font-bold text-sm uppercase tracking-wide text-slate-400 mb-3">Eligibility</h4>
                                  <ul className="space-y-2 text-sm text-slate-700 dark:text-gray-300">
                                    {selectedScholarship.eligibility && selectedScholarship.eligibility.length > 0 ? (
                                      selectedScholarship.eligibility.map((item, index) => (
                                        <li key={index} className="flex gap-2 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-1.5 shrink-0"></div> 
                                            {item}
                                        </li>
                                      ))
                                    ) : (
                                        <li className="italic text-slate-500">No specific eligibility criteria listed.</li>
                                    )}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-bold text-sm uppercase tracking-wide text-slate-400 mb-3">Requirements</h4>
                                  <ul className="space-y-2 text-sm text-slate-700 dark:text-gray-300">
                                    {selectedScholarship.requirements && selectedScholarship.requirements.length > 0 ? (
                                      selectedScholarship.requirements.map((item, index) => (
                                        <li key={index} className="flex gap-2 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-violet mt-1.5 shrink-0"></div> 
                                            {item}
                                        </li>
                                      ))
                                    ) : (
                                        <li className="italic text-slate-500">No specific requirements listed.</li>
                                    )}
                                  </ul>
                                </div>
                             </div>
                          </div>
                       </div>

                       {/* Sticky Footer Action */}
                       <div className="sticky bottom-0 p-6 bg-white/90 dark:bg-navy-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-white/10 flex justify-end gap-4">
                          <Button 
                            variant="outline" 
                            size="lg"
                            onClick={() => selectedScholarship.websiteUrl && window.open(selectedScholarship.websiteUrl, '_blank')}
                          >
                            Visit Website
                          </Button>
                          <Button 
                            variant="primary" 
                            size="lg" 
                            className="px-8 shadow-lg shadow-accent-blue/20"
                            onClick={() => setApplicationScholarship(selectedScholarship)}
                          >
                             Apply Now <ExternalLink size={18} className="ml-2" />
                          </Button>
                       </div>
                    </div>
                  ) : (
                    /* Modern Empty State */
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
                       {/* Background Decoration */}
                       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-blue/5 to-transparent opacity-50"></div>
                       
                       <div className="relative z-10 max-w-sm">
                          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-slate-100 to-white dark:from-navy-800 dark:to-navy-900 border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-center rotate-3 transform transition-transform hover:rotate-0 duration-500">
                              <Search size={40} className="text-accent-blue opacity-80" />
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                             Select a Scholarship
                          </h3>
                          <p className="text-slate-500 dark:text-gray-400 mb-8 leading-relaxed">
                             Click on any opportunity from the list on the left to view full details, requirements, and application steps.
                          </p>
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 text-xs font-medium text-slate-500 dark:text-gray-400">
                             <Map className="w-3 h-3" />
                             <span>Browsing Philippines Region</span>
                          </div>
                       </div>
                    </div>
                  )}
              </div>
           </div>
        </div>
      </div>

      {/* Application Wizard Modal */}
      <ApplicationModal 
        isOpen={!!applicationScholarship}
        scholarship={applicationScholarship}
        onClose={() => setApplicationScholarship(null)}
      />
    </div>
  );
};

export default DashboardHome;
