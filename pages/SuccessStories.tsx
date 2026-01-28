import React from 'react';
import GlassCard from '../components/GlassCard';
import { Quote } from 'lucide-react';

const stories = [
  {
    name: "Maria Santos",
    school: "University of the Philippines Diliman",
    scholarship: "DOST-SEI Merit Scholarship",
    amount: "₱40,000/sem",
    quote: "EduAid helped me find the DOST scholarship which now covers my tuition and monthly stipend. I can focus on my Engineering degree worry-free.",
    imageColor: "bg-purple-500"
  },
  {
    name: "Gabriel Cruz",
    school: "De La Salle University",
    scholarship: "Gokongwei Brothers Grant",
    amount: "Full Tuition",
    quote: "I thought studying in a private university was impossible, but EduAid matched me with a full scholarship based on my grades.",
    imageColor: "bg-blue-500"
  },
  {
    name: "Ana Reyes",
    school: "Polytechnic University of the Philippines",
    scholarship: "CHED Tulong Dunong",
    amount: "₱15,000/sem",
    quote: "The platform is so easy to use. I found a government grant that supports students in state universities like me.",
    imageColor: "bg-pink-500"
  },
  {
    name: "James Dizon",
    school: "Ateneo de Manila University",
    scholarship: "SM Foundation",
    amount: "Full Ride",
    quote: "The deadline reminders were a lifesaver. I submitted my requirements for the SM scholarship just in time.",
    imageColor: "bg-green-500"
  }
];

const SuccessStories: React.FC = () => {
  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
          Success <span className="text-accent-violet">Stories</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
          Join thousands of Filipino students who have secured funding for their dreams through EduAid.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {stories.map((story, index) => (
          <GlassCard key={index} className="flex flex-col">
            <div className="mb-6 text-accent-blue/50">
              <Quote size={40} />
            </div>
            <p className="text-lg text-slate-700 dark:text-gray-300 italic mb-6 flex-grow">
              "{story.quote}"
            </p>
            
            <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-white/10">
              <div className={`w-12 h-12 rounded-full ${story.imageColor} flex items-center justify-center text-white font-bold text-lg`}>
                {story.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{story.name}</h4>
                <p className="text-sm text-slate-500 dark:text-gray-400">{story.school}</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-accent-blue/5 dark:bg-accent-blue/10 rounded-lg border border-accent-blue/10">
              <p className="text-sm text-slate-600 dark:text-gray-300">
                <span className="font-semibold text-accent-blue">Won:</span> {story.scholarship}
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                Amount: {story.amount}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default SuccessStories;