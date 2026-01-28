import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const HelpCenter: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Is EduAid free to use?",
      a: "Yes! EduAid is completely free for students. We partner with institutions and sponsors who cover the costs."
    },
    {
      q: "How does the scholarship matching work?",
      a: "Our AI analyzes your profile (GPA, major, interests, location) and cross-references it with eligibility criteria from our database to find the best matches."
    },
    {
      q: "Can I apply for scholarships directly on EduAid?",
      a: "For 'Verified' partners, yes. For others, we provide a direct link to the sponsor's external application portal."
    },
    {
      q: "How do I edit my profile?",
      a: "Once logged in, click on your avatar in the top right corner and select 'Profile'. You can update your academic info and preferences there."
    }
  ];

  return (
    <div className="pt-24 pb-20 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Help Center</h1>
        <p className="text-slate-600 dark:text-gray-400 mb-8">Find answers to common questions or get in touch.</p>
        
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for help topics..."
            className="w-full glass-input rounded-full pl-12 pr-4 py-3 text-slate-900 dark:text-white border border-slate-300 dark:border-white/20 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all bg-white/50 dark:bg-navy-900/50 backdrop-blur-sm"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <GlassCard className="text-center p-6 hover:border-accent-blue/50">
          <Mail className="mx-auto text-accent-blue mb-4" size={32} />
          <h3 className="font-bold text-lg mb-2 dark:text-white">Email Support</h3>
          <p className="text-sm text-slate-600 dark:text-gray-400 mb-4">Get a response within 24 hours.</p>
          <Button size="sm" variant="outline">Contact Us</Button>
        </GlassCard>
        <GlassCard className="text-center p-6 hover:border-accent-mint/50">
          <MessageCircle className="mx-auto text-accent-mint mb-4" size={32} />
          <h3 className="font-bold text-lg mb-2 dark:text-white">Live Chat</h3>
          <p className="text-sm text-slate-600 dark:text-gray-400 mb-4">Available Mon-Fri, 9am-5pm EST.</p>
          <Button size="sm" variant="outline">Start Chat</Button>
        </GlassCard>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
        {faqs.map((item, index) => (
          <GlassCard 
            key={index} 
            className="p-0 overflow-hidden cursor-pointer transition-all"
            hoverEffect={false}
          >
            <div 
              className="p-6 flex justify-between items-center"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <h3 className="font-semibold text-slate-900 dark:text-white">{item.q}</h3>
              {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {openIndex === index && (
              <div className="px-6 pb-6 text-slate-600 dark:text-gray-400 border-t border-slate-200 dark:border-white/5 pt-4 bg-slate-50/50 dark:bg-white/5">
                {item.a}
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default HelpCenter;