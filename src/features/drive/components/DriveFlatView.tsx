import React from 'react';
import { Loader2 } from 'lucide-react';
import { DriveFlatViewContent } from '@features/drive/components/DriveFlatViewContent';
import { DriveFlatViewModals } from '@features/drive/components/DriveFlatViewModals';
import { useDriveFlatView } from '@features/drive/hooks/use-drive-flat-view';

interface DriveFlatViewProps {
  section: 'recent' | 'trash';
}

export const DriveFlatView: React.FC<DriveFlatViewProps> = ({ section }) => {
  const view = useDriveFlatView(section);

  if (view.isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <>
      <DriveFlatViewContent section={section} view={view} />
      <DriveFlatViewModals section={section} view={view} />
    </>
  );
};

export default DriveFlatView;
