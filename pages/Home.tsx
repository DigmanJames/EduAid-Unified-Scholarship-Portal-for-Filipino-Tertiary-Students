import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, Bell, BarChart3, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

const Home: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center z-10">
          
          {/* Text Content */}
          <div className="space-y-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue/5 border border-accent-blue/10 text-accent-cyan text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></span>
              New Philippine Scholarships Added Daily
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-heading leading-tight text-slate-900 dark:text-white">
              Find Scholarships That <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-cyan">Match Your Future</span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-gray-400 max-w-xl mx-auto md:mx-0">
              Discover verified scholarships from CHED, DOST, and private foundations tailored to your profile.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/scholarships">
                <Button size="lg" variant="primary" icon={<Search size={20} />}>
                  Find Scholarships
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline">
                  Create Profile
                </Button>
              </Link>
            </div>
            
            <div className="pt-4 flex items-center justify-center md:justify-start gap-8 text-sm text-slate-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-accent-mint w-4 h-4" />
                <span>Government Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-accent-mint w-4 h-4" />
                <span>Free for Students</span>
              </div>
            </div>
          </div>

          {/* Hero Visuals - Floating Glass Cards */}
          <div className="relative h-[500px] hidden md:block perspective-1000">
            <GlassCard className="absolute top-10 right-10 w-72 z-20 animate-[float_6s_ease-in-out_infinite]">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-accent-blue/20 rounded-full text-accent-blue">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">DOST-SEI</h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400">Verified Sponsor</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-slate-200 dark:bg-white/10 rounded w-3/4"></div>
                <div className="h-2 bg-slate-200 dark:bg-white/10 rounded w-1/2"></div>
              </div>
            </GlassCard>

            <GlassCard className="absolute top-40 left-0 w-80 z-30 animate-[float_8s_ease-in-out_infinite_1s]">
              <div className="flex justify-between items-start mb-2">
                 <h3 className="font-bold text-lg text-slate-900 dark:text-white">CHED Merit Scholarship</h3>
                 <span className="px-2 py-1 bg-accent-mint/20 text-accent-mint text-xs rounded-full">₱120k/yr</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">Full financial assistance for priority courses.</p>
              <Button size="sm" fullWidth>Apply Now</Button>
            </GlassCard>

             <GlassCard className="absolute bottom-20 right-20 w-64 z-10 animate-[float_7s_ease-in-out_infinite_2s] opacity-80">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-violet to-purple-600 flex items-center justify-center text-white font-bold">98%</div>
                 <div>
                   <p className="text-sm text-slate-900 dark:text-white font-medium">Match Score</p>
                   <p className="text-xs text-slate-500 dark:text-gray-400">Based on your profile</p>
                 </div>
               </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Why Choose EduAid?</h2>
            <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">We simplify the scholarship search process for Filipino students with advanced technology.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Search className="text-accent-blue" size={32} />}
              title="Smart Matching"
              description="Our AI algorithms match you with scholarships that fit your academic standing and financial needs."
            />
            <FeatureCard 
              icon={<Bell className="text-accent-violet" size={32} />}
              title="Deadline Alerts"
              description="Never miss an opportunity. Get notified when deadlines for CHED, DOST, or private grants are near."
            />
             <FeatureCard 
              icon={<BarChart3 className="text-accent-mint" size={32} />}
              title="Application Tracker"
              description="Manage all your applications in one dashboard. Track status from submission to acceptance."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-slate-100/50 dark:bg-navy-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-slate-600 dark:text-gray-400">Your journey to financial freedom in 4 simple steps.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-accent-blue/0 via-accent-blue/30 to-accent-blue/0"></div>

            {[
              { step: "01", title: "Create Profile", desc: "Sign up and complete your academic profile." },
              { step: "02", title: "Get Matched", desc: "Our system finds the best scholarships for you." },
              { step: "03", title: "Apply Online", desc: "Submit applications directly or via sponsor sites." },
              { step: "04", title: "Track Progress", desc: "Monitor status and accept awards." },
            ].map((item, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-6 group-hover:border-accent-blue/50 transition-all shadow-xl">
                  <span className="text-2xl font-bold text-accent-blue">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({ icon, title, description }) => (
  <GlassCard className="flex flex-col items-start p-8">
    <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{title}</h3>
    <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{description}</p>
  </GlassCard>
);

export default Home;