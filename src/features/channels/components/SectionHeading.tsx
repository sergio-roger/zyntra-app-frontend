import React from 'react';

interface SectionHeadingProps {
  icon: React.ElementType;
  label: string;
  tone?: 'default' | 'error';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ icon: Icon, label, tone = 'default' }) => {
  const toneClass = tone === 'error' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary';
  return (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${toneClass}`}>
        <Icon size={16} />
      </div>
      <h2 className={`font-bold text-base ${tone === 'error' ? 'text-error' : ''}`}>{label}</h2>
    </div>
  );
};
