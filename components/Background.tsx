import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="gradient-bg">
      {/* Orbs adjusted for visibility in both modes */}
      <div className="orb bg-accent-blue w-[500px] h-[500px] top-[-100px] left-[-100px] opacity-10 dark:opacity-20 animate-pulse"></div>
      <div className="orb bg-accent-violet w-[600px] h-[600px] bottom-[-100px] right-[-100px] opacity-10 dark:opacity-15"></div>
      <div className="orb bg-accent-cyan w-[300px] h-[300px] top-[40%] left-[40%] opacity-5 dark:opacity-10"></div>
    </div>
  );
};

export default Background;