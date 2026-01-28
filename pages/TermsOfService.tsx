import React from 'react';
import GlassCard from '../components/GlassCard';

const TermsOfService: React.FC = () => {
  return (
    <div className="pt-24 pb-20 px-4 max-w-4xl mx-auto">
      <GlassCard className="p-8 md:p-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-gray-300">
          <p className="mb-4">Last updated: October 2023</p>
          
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">1. Acceptance of Terms</h3>
          <p className="mb-4">
            By accessing and using EduAid, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">2. Use of the Platform</h3>
          <p className="mb-4">
            EduAid provides a scholarship matching service. You agree to provide accurate, current, and complete information during the registration process.
            Misrepresentation of academic credentials or financial status may result in account termination.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">3. Intellectual Property</h3>
          <p className="mb-4">
            All content on this site, including text, graphics, logos, and software, is the property of EduAid or its content suppliers and is protected by international copyright laws.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">4. Limitation of Liability</h3>
          <p className="mb-4">
            EduAid is not responsible for the actual awarding of scholarships, which is at the sole discretion of the third-party sponsors. We do not guarantee that you will receive funding.
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default TermsOfService;