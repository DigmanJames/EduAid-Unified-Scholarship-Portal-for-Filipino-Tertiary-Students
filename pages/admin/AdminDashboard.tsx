
import React, { useMemo } from 'react';
import GlassCard from '../../components/GlassCard';
import { Users, FileText, GraduationCap, TrendingUp, Bell, Calendar } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useScholarships } from '../../context/ScholarshipContext';

const AdminDashboard: React.FC = () => {
  const { allApplications } = useUser(); // Use allApplications for Admin view
  const { scholarships } = useScholarships();

  const totalApplicants = allApplications.length;
  
  // Updated Pending Logic: Anything not Accepted or Rejected is pending action
  const pendingApps = allApplications.filter(a => a.status !== 'Accepted' && a.status !== 'Rejected').length;
  
  const activeScholarships = scholarships.length;
  
  // Calculate funds based on Accepted applications and their specific scholarship amounts
  const acceptedApps = allApplications.filter(a => a.status === 'Accepted');
  
  const fundsDisbursed = acceptedApps.reduce((total, app) => {
      const scholarship = scholarships.find(s => s.id === app.scholarshipId);
      if (scholarship) {
          // Extract numerical value from string like "₱120,000 / year"
          const amountString = scholarship.amount;
          const numberString = amountString.replace(/[^0-9]/g, '');
          const amount = parseInt(numberString);
          
          if (!isNaN(amount)) {
              return total + amount;
          } else if (amountString.toLowerCase().includes('full')) {
              // Estimate for "Full Tuition" if no number present
              return total + 50000; 
          }
      }
      return total;
  }, 0);

  const formattedFunds = fundsDisbursed >= 1000000 
    ? `₱${(fundsDisbursed / 1000000).toFixed(1)}M` 
    : `₱${(fundsDisbursed / 1000).toFixed(0)}k`;

  const stats = [
    { label: 'Total Applicants', value: totalApplicants.toString(), icon: <Users size={24} />, color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
    { label: 'Pending Applications', value: pendingApps.toString(), icon: <FileText size={24} />, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Active Scholarships', value: activeScholarships.toString(), icon: <GraduationCap size={24} />, color: 'text-accent-violet', bg: 'bg-accent-violet/10' },
    { label: 'Funds Disbursed', value: formattedFunds, icon: <TrendingUp size={24} />, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  // Get 5 most recent applications
  const recentApplications = [...allApplications]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 5);

  // Calculate Data for Last 5 Days
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();

    for (let i = 4; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      // Match format stored in UserContext: "Oct 24, 2023"
      // Note: This depends on the locale used in UserContext. 
      // We use the same formatting options here to ensure string matching works.
      const dateString = d.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      });

      // Short label for X-Axis: "Oct 24"
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const count = allApplications.filter(app => app.dateApplied === dateString).length;

      data.push({ label, apps: count });
    }
    return data;
  }, [allApplications]);

  // Determine max value for chart scaling (prevent division by zero)
  const maxApps = Math.max(...chartData.map(d => d.apps)) || 5;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="p-6 flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Application Trends Chart */}
        <GlassCard className="p-8 h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-500 dark:text-gray-300">
                        <TrendingUp size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Application Trends</h3>
                </div>
                <select className="bg-transparent text-sm font-medium text-slate-500 focus:outline-none cursor-pointer">
                    <option>Last 5 Days</option>
                </select>
            </div>
            
            {/* Bar Chart Visual */}
            <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 w-full px-2">
                {chartData.map((item, index) => {
                    const heightPercentage = (item.apps / maxApps) * 100;
                    // Ensure at least a tiny bar is visible if 0, or hide completely? 
                    // Let's show at least 2% height so label aligns
                    const visualHeight = item.apps === 0 ? 2 : heightPercentage;
                    
                    return (
                        <div key={index} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer h-full justify-end">
                            {/* Tooltip */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded mb-1 pointer-events-none">
                                {item.apps} Apps
                            </div>
                            
                            {/* Bar */}
                            <div 
                                className={`w-full max-w-[40px] rounded-t-lg relative overflow-hidden transition-all duration-500 group-hover:scale-y-105 origin-bottom
                                    ${item.apps > 0 ? 'bg-accent-blue/20 dark:bg-accent-blue/10 group-hover:bg-accent-blue/40' : 'bg-slate-100 dark:bg-white/5'}
                                `}
                                style={{ height: `${visualHeight}%` }}
                            >
                                {item.apps > 0 && (
                                    <div className="absolute bottom-0 left-0 w-full bg-accent-blue h-1 opacity-50"></div>
                                )}
                            </div>
                            
                            {/* Label */}
                            <span className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-gray-400">{item.label}</span>
                        </div>
                    );
                })}
            </div>
        </GlassCard>
        
        <GlassCard className="p-6 h-[400px] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-accent-blue/10 rounded-lg text-accent-blue">
                  <Bell size={20} />
               </div>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activities</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
               {recentApplications.length > 0 ? (
                  recentApplications.map((app) => (
                     <div key={app.id} className="flex gap-3 items-start p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-white/5">
                        <div className="w-8 h-8 rounded-full bg-accent-violet/20 text-accent-violet flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                           {app.applicantName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                           <p className="text-sm text-slate-800 dark:text-gray-200">
                              <span className="font-bold">{app.applicantName}</span> applied for <span className="font-semibold text-accent-blue">{app.scholarshipTitle}</span>
                           </p>
                           <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                              <Calendar size={10} /> {app.dateApplied}
                           </p>
                        </div>
                     </div>
                  ))
               ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                     <p>No recent activity.</p>
                  </div>
               )}
            </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminDashboard;
