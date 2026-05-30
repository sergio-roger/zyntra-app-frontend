import React from 'react';
import { Sparkles } from 'lucide-react';

interface BrandLogoProps {
  isSidebarOpen: boolean;
  onToggle: (open: boolean) => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  isSidebarOpen, 
  onToggle 
}) => (
  <div 
    className="mb-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 shadow-lg shadow-fuchsia-500/30" 
    onClick={() => onToggle(!isSidebarOpen)}
  >
    <Sparkles size={18} className="text-white" />
  </div>
);
