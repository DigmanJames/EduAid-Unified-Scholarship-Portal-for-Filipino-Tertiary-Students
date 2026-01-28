
import React, { useState } from 'react';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { Plus, Trash2, Edit, Eye, ShieldCheck, MapPin, Award, Calendar, Sparkles, X, ExternalLink, Link, AlertTriangle } from 'lucide-react';
import { useScholarships } from '../../context/ScholarshipContext';
import { Scholarship } from '../../types';
import { COMMON_ELIGIBILITY, COMMON_REQUIREMENTS } from '../../data/mockData';
import { getScholarshipIcon } from '../../components/ScholarshipCard';

const AdminScholarships: React.FC = () => {
  const { scholarships, addScholarship, updateScholarship, deleteScholarship } = useScholarships();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // View Modal State
  const [viewingScholarship, setViewingScholarship] = useState<Scholarship | null>(null);
  
  // Delete Modal State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (deleteId) {
      setDeleteError(null);
      try {
        await deleteScholarship(deleteId);
        setDeleteId(null);
      } catch (error: any) {
        console.error("Delete failed:", error);
        if (error.code === 'permission-denied') {
             setDeleteError("Permission denied. You do not have access to delete this data. Check Firestore Security Rules.");
        } else {
             setDeleteError("Failed to delete scholarship. See console for details.");
        }
      }
    }
  };
  
  // Separate states for Amount parts
  const [amountValue, setAmountValue] = useState('');
  const [amountFreq, setAmountFreq] = useState('year');

  // Arrays for selection
  const [selectedEligibility, setSelectedEligibility] = useState<string[]>([]);
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);

  // Form State
  const [formData, setFormData] = useState<Partial<Scholarship>>({
    title: '',
    sponsor: '',
    deadline: '',
    category: 'Merit',
    location: '',
    description: '',
    websiteUrl: '',
    tags: []
  });

  // Reset form to default state
  const resetForm = () => {
    setFormData({
        title: '',
        sponsor: '',
        deadline: '',
        category: 'Merit',
        location: '',
        description: '',
        websiteUrl: '',
        tags: []
    });
    setAmountValue('');
    setAmountFreq('year');
    setSelectedEligibility([]);
    setSelectedRequirements([]);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
      resetForm();
      setIsModalOpen(true);
  };

  const handleOpenEdit = (scholarship: Scholarship) => {
      setEditingId(scholarship.id);
      setFormData({
          title: scholarship.title,
          sponsor: scholarship.sponsor,
          deadline: scholarship.deadline,
          category: scholarship.category,
          location: scholarship.location,
          description: scholarship.description,
          websiteUrl: scholarship.websiteUrl || '',
          tags: scholarship.tags
      });
      
      // Parse Amount
      const nums = scholarship.amount.replace(/[^0-9]/g, '');
      setAmountValue(nums);
      setAmountFreq(scholarship.amount.toLowerCase().includes('sem') ? 'sem' : 'year');

      // Set Arrays
      setSelectedEligibility(scholarship.eligibility || []);
      setSelectedRequirements(scholarship.requirements || []);

      setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSelection = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
      if (list.includes(item)) {
          setList(list.filter(i => i !== item));
      } else {
          setList([...list, item]);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct Amount String
    const finalAmount = `₱${Number(amountValue).toLocaleString()} / ${amountFreq}`;

    if (editingId) {
        // UPDATE Existing
        const updatedScholarship: Scholarship = {
            ...formData as Scholarship,
            id: editingId,
            amount: finalAmount,
            eligibility: selectedEligibility,
            requirements: selectedRequirements,
            // Preserve existing fields not in form
            matchScore: scholarships.find(s => s.id === editingId)?.matchScore || 80,
            isUrgent: scholarships.find(s => s.id === editingId)?.isUrgent || false,
            logoUrl: scholarships.find(s => s.id === editingId)?.logoUrl,
            coverImage: scholarships.find(s => s.id === editingId)?.coverImage,
        };
        updateScholarship(updatedScholarship);
    } else {
        // CREATE New
        const newScholarship: Scholarship = {
            id: Date.now().toString(),
            title: formData.title || 'Untitled',
            sponsor: formData.sponsor || 'Unknown',
            amount: finalAmount,
            deadline: formData.deadline || 'TBD',
            category: (formData.category as any) || 'Merit',
            description: formData.description || '',
            tags: ['New'],
            isUrgent: false,
            location: formData.location || 'National',
            matchScore: 100, 
            eligibility: selectedEligibility,
            requirements: selectedRequirements,
            websiteUrl: formData.websiteUrl
        };
        addScholarship(newScholarship);
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Scholarships</h1>
        <Button variant="primary" icon={<Plus size={18} />} onClick={handleOpenAdd}>
           Add New Scholarship
        </Button>
      </div>

      <div className="grid gap-4">
        {scholarships.map((s) => (
           <GlassCard key={s.id} className="p-6 flex flex-col md:flex-row items-start md:items-center gap-4 group hover:border-accent-blue/30 transition-colors">
              <div className="flex-1">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-accent-blue transition-colors">{s.title}</h3>
                 <p className="text-sm text-slate-500 dark:text-gray-400">{s.sponsor} • {s.category}</p>
                 <div className="flex gap-3 mt-2 text-xs text-slate-400">
                    <span>Deadline: {s.deadline}</span>
                    <span>|</span>
                    <span className="text-accent-blue font-semibold">{s.amount}</span>
                 </div>
              </div>
              <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                 <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={<Eye size={16} />}
                    onClick={() => setViewingScholarship(s)}
                    title="View Details"
                 >
                    View
                 </Button>
                 <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={<Edit size={16} />}
                    onClick={() => handleOpenEdit(s)}
                    title="Edit"
                 >
                    Edit
                 </Button>
                 <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    icon={<Trash2 size={16} />}
                    onClick={() => setDeleteId(s.id)}
                    title="Delete"
                 >
                    Delete
                 </Button>
              </div>
           </GlassCard>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
           <GlassCard className="w-full max-w-lg p-8 bg-white dark:bg-navy-900 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  {editingId ? 'Edit Scholarship' : 'Add New Scholarship'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1">Scholarship Title</label>
                    <input name="title" value={formData.title} onChange={handleInputChange} required className="w-full glass-input p-3 rounded-lg dark:text-white" placeholder="e.g. Future Leaders Grant" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1">Sponsor</label>
                    <input name="sponsor" value={formData.sponsor} onChange={handleInputChange} required className="w-full glass-input p-3 rounded-lg dark:text-white" placeholder="e.g. Ayala Foundation" />
                 </div>
                 
                 {/* Amount with Frequency */}
                 <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1">Amount (Approx.)</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₱</span>
                            <input 
                                value={amountValue} 
                                onChange={(e) => setAmountValue(e.target.value)} 
                                required 
                                className="w-full glass-input p-3 pl-8 rounded-lg dark:text-white" 
                                placeholder="50000" 
                                type="number"
                            />
                        </div>
                        <select 
                            value={amountFreq} 
                            onChange={(e) => setAmountFreq(e.target.value)} 
                            className="glass-input p-3 rounded-lg dark:text-white dark:bg-navy-800 w-32"
                        >
                            <option value="year">/ year</option>
                            <option value="sem">/ sem</option>
                        </select>
                    </div>
                 </div>

                 {/* Date Picker */}
                 <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1">Deadline</label>
                    <input 
                        name="deadline" 
                        value={formData.deadline} 
                        onChange={handleInputChange} 
                        required 
                        type="date" 
                        className="w-full glass-input p-3 rounded-lg dark:text-white" 
                    />
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1">Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full glass-input p-3 rounded-lg dark:text-white dark:bg-navy-800">
                        <option value="Merit">Merit-Based</option>
                        <option value="Need-Based">Need-Based</option>
                        <option value="Arts">Arts</option>
                        <option value="Research">Research</option>
                        <option value="Government">Government</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1">Location</label>
                    <input name="location" value={formData.location} onChange={handleInputChange} className="w-full glass-input p-3 rounded-lg dark:text-white" placeholder="e.g. Manila" />
                 </div>
                 
                 {/* Website URL Input */}
                 <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1">Website URL (Optional)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Link size={16} /></span>
                        <input 
                            name="websiteUrl" 
                            value={formData.websiteUrl || ''} 
                            onChange={handleInputChange} 
                            className="w-full glass-input p-3 pl-10 rounded-lg dark:text-white" 
                            placeholder="https://scholarship-site.com" 
                        />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} required className="w-full glass-input p-3 rounded-lg dark:text-white h-24" placeholder="Brief description..." />
                 </div>

                 {/* Eligibility Checkboxes */}
                 <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Eligibility Criteria</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 dark:border-white/10 rounded-lg">
                        {COMMON_ELIGIBILITY.map(item => (
                            <label key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={selectedEligibility.includes(item)}
                                    onChange={() => toggleSelection(item, selectedEligibility, setSelectedEligibility)}
                                    className="rounded border-slate-300 text-accent-blue focus:ring-accent-blue"
                                />
                                {item}
                            </label>
                        ))}
                    </div>
                 </div>

                 {/* Requirements Checkboxes */}
                 <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Requirements</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 dark:border-white/10 rounded-lg">
                        {COMMON_REQUIREMENTS.map(item => (
                            <label key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={selectedRequirements.includes(item)}
                                    onChange={() => toggleSelection(item, selectedRequirements, setSelectedRequirements)}
                                    className="rounded border-slate-300 text-accent-blue focus:ring-accent-blue"
                                />
                                {item}
                            </label>
                        ))}
                    </div>
                 </div>
                 
                 <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" variant="primary">
                        {editingId ? 'Save Changes' : 'Create Scholarship'}
                    </Button>
                 </div>
              </form>
           </GlassCard>
        </div>
      )}

      {/* View Modal (Read Only) */}
      {viewingScholarship && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-300">
           {/* Modal Container */}
           <div 
             className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-navy-900 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10 relative"
             onClick={(e) => e.stopPropagation()}
           >
              
              {/* Close Button */}
              <button 
                onClick={() => setViewingScholarship(null)}
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
                             {React.cloneElement(getScholarshipIcon(viewingScholarship.category, viewingScholarship.title), { size: 56 })}
                        </div>
                        
                        {/* Title & Organization */}
                        <div className="pt-2 sm:pt-16">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
                               {viewingScholarship.title}
                            </h2>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className="flex items-center gap-1.5 font-semibold text-accent-blue bg-accent-blue/10 px-3 py-1 rounded-full border border-accent-blue/20">
                                   <ShieldCheck size={16} /> {viewingScholarship.sponsor}
                                </span>
                                <span className="flex items-center gap-1.5 text-slate-500 dark:text-gray-400">
                                   <MapPin size={16} /> {viewingScholarship.location || "National"}
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
                             <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{viewingScholarship.amount}</p>
                           </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center gap-4">
                           <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
                              <Calendar size={24} />
                           </div>
                           <div>
                             <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Deadline</span>
                             <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{viewingScholarship.deadline}</p>
                           </div>
                        </div>
                     </div>

                     {/* Main Description */}
                     <div className="space-y-8">
                        <div>
                           <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">About the Scholarship</h3>
                           <p className="text-slate-600 dark:text-gray-300 leading-relaxed text-base">
                              {viewingScholarship.description}
                           </p>
                        </div>

                        {/* Requirements / Eligibility Grid */}
                        <div className="grid md:grid-cols-2 gap-8 p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                           <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-accent-blue"></div> Eligibility
                              </h4>
                              <ul className="space-y-3">
                                 {viewingScholarship.eligibility && viewingScholarship.eligibility.length > 0 ? (
                                    viewingScholarship.eligibility.map((item, index) => (
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
                                 {viewingScholarship.requirements && viewingScholarship.requirements.length > 0 ? (
                                    viewingScholarship.requirements.map((item, index) => (
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

              {/* Footer */}
              <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-white/80 dark:bg-navy-900/90 backdrop-blur-md flex gap-4 shrink-0 z-20 justify-end">
                  <Button 
                     variant="ghost" 
                     onClick={() => setViewingScholarship(null)}
                  >
                     Close View
                  </Button>
                  {viewingScholarship.websiteUrl && (
                    <Button 
                        variant="outline" 
                        icon={<ExternalLink size={16} />}
                        onClick={() => window.open(viewingScholarship.websiteUrl, '_blank')}
                    >
                        Visit Website
                    </Button>
                  )}
              </div>
           </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
           <GlassCard className="w-full max-w-md p-6 bg-white dark:bg-navy-900 border border-red-100 dark:border-red-900/30 shadow-2xl">
              <div className="flex flex-col items-center text-center mb-6">
                 <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-4 animate-in zoom-in duration-300">
                    <AlertTriangle size={32} />
                 </div>
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Scholarship?</h2>
                 <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                    Are you sure you want to delete this scholarship? This action will also delete all associated applications and cannot be undone.
                 </p>
                 {deleteError && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400 w-full font-bold">
                        {deleteError}
                    </div>
                 )}
              </div>
              <div className="flex gap-3">
                 <Button fullWidth variant="ghost" onClick={() => { setDeleteId(null); setDeleteError(null); }}>Cancel</Button>
                 <Button fullWidth variant="danger" onClick={confirmDelete}>
                    Yes, Delete
                 </Button>
              </div>
           </GlassCard>
        </div>
      )}
    </div>
  );
};

export default AdminScholarships;
