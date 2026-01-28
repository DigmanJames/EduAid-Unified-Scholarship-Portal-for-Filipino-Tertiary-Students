import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = true }) => {
  return (
    <div className={`glass-card rounded-2xl p-6 ${hoverEffect ? 'hover:scale-[1.02] cursor-pointer' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;