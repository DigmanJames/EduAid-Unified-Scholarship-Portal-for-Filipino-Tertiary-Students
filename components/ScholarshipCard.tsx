
import React from 'react';
import { ShieldCheck, Calendar, Sparkles, MapPin, Clock, Building2, Heart, Atom, Palette, Award, HandCoins, Microscope, GraduationCap, BookOpen } from 'lucide-react';
import GlassCard from './GlassCard';
import Button from './Button';
import { Scholarship } from '../types';

interface ScholarshipCardProps {
  data: Scholarship;
  showMatch?: boolean;
  compact?: boolean;
  variant?: 'grid' | 'list';
  isSelected?: boolean;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onClick?: () => void;
  onApply?: (scholarship: Scholarship) => void;
}

export const getScholarshipIcon = (category: string, title: string, size = 24) => {
  const t = title.toLowerCase();
  const c = category.toLowerCase();

  const props = { size };

  if (t.includes('science') || t.includes('tech') || t.includes('dost') || t.includes('stem')) return <Atom {...props} />;
  if (c.includes('arts') || t.includes('arts') || t.includes('design')) return <Palette {...props} />;
  if (c.includes('research') || t.includes('research')) return <Microscope {...props} />;
  if (c.includes('need') || t.includes('financial') || t.includes('tulong')) return <HandCoins {...props} />;
  if (c.includes('merit') || t.includes('excellence')) return <Award {...props} />;
  if (t.includes('foundation')) return <Building2 {...props} />;
  
  return <GraduationCap {...props} />;
};

// Helper for relative time
const getRelativeTime = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    const now = new Date();
    const posted = new Date(dateStr);
    const diff = now.getTime() - posted.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    return posted.toLocaleDateString(); // Fallback to date
};

const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ 
  data, 
  showMatch = false, 
  compact = false, 
  variant = 'grid',
  isSelected = false,
  isSaved = false,
  onToggleSave,
  onClick,
  onApply
}) => {

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSave) {
      onToggleSave(data.id);
    }
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApply) {
      onApply(data);
    }
  };

  const IconComponent = getScholarshipIcon(data.category, data.title, variant === 'list' ? 32 : 24);
  const postedTime = getRelativeTime(data.datePosted);

  if (variant === 'list') {
    return (
      <div 
        onClick={onClick}
        className={`
          group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer
          ${isSelected 
            ? 'bg-accent-blue/5 dark:bg-accent-blue/10 border-accent-blue shadow-[0_0_0_1px_rgba(79,139,255,0.5)]' 
            : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-white/10 hover:border-accent-blue/50 hover:shadow-md'
          }
        `}
      >
        {/* Active Indicator Bar */}
        {isSelected && (
          <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-accent-blue"></div>
        )}

        <div className="flex justify-between items-start gap-4 pl-2">
          <div className="flex-1 min-w-0">
            <h3 className={`text-base md:text-lg font-bold mb-1 truncate leading-tight ${isSelected ? 'text-accent-blue' : 'text-slate-900 dark:text-white group-hover:text-accent-blue'}`}>
              {data.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-gray-300 font-medium mb-2 flex items-center gap-1">
               <Building2 size={14} className="shrink-0 text-slate-400" /> {data.sponsor}
            </p>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
               {data.isUrgent && (
                 <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wide">
                   Urgent
                 </span>
               )}
               {data.matchScore && data.matchScore > 80 && (
                 <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 text-[10px] font-bold uppercase tracking-wide">
                   High Match
                 </span>
               )}
               <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wide">
                  {data.category}
               </span>
            </div>

            <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-gray-400">
              {data.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="shrink-0" />
                  <span className="truncate">{data.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-gray-200 font-semibold mt-1">
                 <span className="font-bold text-accent-mint">₱</span> {data.amount}
              </div>
            </div>

            {!compact && (
              <p className="mt-3 text-sm text-slate-500 dark:text-gray-400 line-clamp-2">
                {data.description}
              </p>
            )}
            
            <div className="mt-3 flex items-center justify-between">
               <span className="text-[10px] text-slate-400 flex items-center gap-1">
                 <Clock size={10} /> {postedTime}
               </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
             {/* Icon Placeholder */}
            <div className={`w-16 h-16 shrink-0 rounded-xl border flex items-center justify-center transition-colors
               ${isSelected 
                  ? 'bg-accent-blue/10 border-accent-blue/30 text-accent-blue' 
                  : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-gray-500'
               }
            `}>
               {IconComponent}
            </div>
            
            {/* Save Button (List View) */}
            <button 
              onClick={handleSaveClick}
              className={`p-2 rounded-full transition-all hover:bg-slate-100 dark:hover:bg-white/10 ${isSaved ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
            >
              <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid Variant (Default)
  return (
    <GlassCard className="flex flex-col h-full relative group overflow-hidden border-t-4 border-t-transparent hover:border-t-accent-blue transition-all">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {showMatch && data.matchScore && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-md
            ${data.matchScore >= 90 ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30' : 
              data.matchScore >= 75 ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30' :
              'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30'
            }`}>
            <Sparkles size={12} fill="currentColor" />
            {data.matchScore}% Match
          </div>
        )}
        {onToggleSave && (
          <button 
            onClick={handleSaveClick}
            className={`p-1.5 rounded-full bg-white/80 dark:bg-navy-900/80 backdrop-blur-sm border border-slate-200 dark:border-white/10 shadow-sm transition-all hover:scale-110 ${isSaved ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
          >
             <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      <div className="mb-4 pt-2">
        <div className="flex flex-wrap gap-2 mb-2">
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium 
            ${data.category === 'Need-Based' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 
              data.category === 'Merit' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' : 
              'bg-purple-500/20 text-purple-600 dark:text-purple-400'}`}>
            {data.category}
          </span>
          {data.isUrgent && (
            <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-600 dark:text-red-400 animate-pulse">
              Closing Soon
            </span>
          )}
        </div>

        <div className="flex items-start gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-accent-blue shrink-0">
             {IconComponent}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-accent-blue transition-colors leading-tight">
              {data.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-gray-400 flex items-center gap-1">
              <ShieldCheck size={14} className="text-accent-blue" /> {data.sponsor}
            </p>
          </div>
        </div>
      </div>

      {!compact && (
        <p className="text-sm text-slate-600 dark:text-gray-400 mb-6 line-clamp-2 flex-grow">
          {data.description}
        </p>
      )}

      <div className="space-y-3 mt-auto">
        <div className="flex items-center justify-between text-sm border-t border-slate-200 dark:border-white/5 pt-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-medium">
            <span className="text-accent-mint font-bold text-lg leading-none">₱</span>
            {data.amount}
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
            <Calendar size={16} />
            {data.deadline}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button variant="outline" size="sm" className="w-full" onClick={onClick}>
             Details
          </Button>
          <Button variant="primary" size="sm" className="w-full group-hover:bg-accent-blue group-hover:text-white transition-all" onClick={handleApplyClick}>
            Apply
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};

export default ScholarshipCard;