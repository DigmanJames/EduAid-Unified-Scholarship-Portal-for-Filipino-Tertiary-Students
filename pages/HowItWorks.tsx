import React from 'react';
import { UserPlus, Search, FileText, Award, CheckCircle, Lightbulb } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <UserPlus size={32} className="text-accent-blue" />,
      title: "Create Your Profile",
      desc: "Sign up and tell us about your academic achievements, interests, and financial needs. The more details you provide, the better our AI can match you."
    },
    {
      icon: <Search size={32} className="text-accent-violet" />,
      title: "Get Matched",
      desc: "Our smart algorithm scans thousands of scholarships to find the ones that fit your profile perfectly. No more endless searching."
    },
    {
      icon: <FileText size={32} className="text-accent-mint" />,
      title: "Apply with Ease",
      desc: "Use our dashboard to manage applications. Some scholarships allow 'Quick Apply' directly through EduAid, while others guide you to the sponsor's site."
    },
    {
      icon: <Award size={32} className="text-amber-400" />,
      title: "Secure Funding",
      desc: "Track your application status, receive interview invites, and accept your awards directly through the portal."
    }
  ];

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
          Your Journey to <span className="text-accent-blue">Funding</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
          We've simplified the scholarship process so you can focus on your education. Here's how EduAid helps you succeed.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-20">
        {steps.map((step, index) => (
          <GlassCard key={index} className="relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-bold text-slate-900 dark:text-white leading-none select-none">
               {index + 1}
             </div>
             <div className="relative z-10 flex flex-col h-full">
               <div className="mb-6 p-4 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit border border-slate-200 dark:border-white/10">
                 {step.icon}
               </div>
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
               <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
             </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-8 md:p-12 bg-gradient-to-r from-accent-blue/10 to-accent-violet/10 border-accent-blue/20">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Lightbulb className="text-yellow-400" /> Pro Tips for Success
            </h3>
            <ul className="space-y-3">
              {[
                "Complete 100% of your profile for better matches.",
                "Apply to smaller, local scholarships (less competition!).",
                "Write a generic personal statement you can tweak for each app.",
                "Check your dashboard weekly for new opportunities."
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-gray-300">
                  <CheckCircle size={20} className="text-accent-mint shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-shrink-0">
             <Link to="/signup">
               <Button size="lg" variant="primary">Start Your Journey</Button>
             </Link>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default HowItWorks;