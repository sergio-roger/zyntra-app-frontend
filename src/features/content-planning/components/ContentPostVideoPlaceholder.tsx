import React from 'react';
import { Video } from 'lucide-react';

export const ContentPostVideoPlaceholder: React.FC = () => (
  <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-base-content/15 bg-base-300/40 p-6 text-sm font-medium text-base-content/50">
    <Video size={16} />
    <span>Video — próximamente</span>
  </div>
);

export default ContentPostVideoPlaceholder;
