import React from 'react';
import GlassCard from '../components/GlassCard';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-24 pb-20 px-4 max-w-4xl mx-auto">
      <GlassCard className="p-8 md:p-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-gray-300">
          <p className="mb-4">Last updated: October 2023</p>
          
          <p className="mb-6">
            At EduAid, we take your privacy seriously. This policy describes what personal information we collect and how we use it.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">Information We Collect</h3>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include:
          </p>
          <ul className="list-disc list-inside mb-4 ml-4">
            <li>Name and contact information</li>
            <li>Academic history and transcripts</li>
            <li>Financial information for need-based assessment</li>
            <li>Demographic information</li>
          </ul>

          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">How We Use Your Information</h3>
          <p className="mb-4">
            We use your information primarily to:
          </p>
          <ul className="list-disc list-inside mb-4 ml-4">
            <li>Match you with relevant scholarships</li>
            <li>Process applications for verified partners</li>
            <li>Send you deadline alerts and updates</li>
            <li>Improve our platform's matching algorithms</li>
          </ul>

          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">Data Security</h3>
          <p className="mb-4">
            We implement industry-standard security measures to protect your personal data. We do not sell your data to third-party advertisers.
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default PrivacyPolicy;