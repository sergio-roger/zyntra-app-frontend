import React from 'react';
import { Loader2 } from 'lucide-react';
import { DriveFolderViewContent } from '@features/drive/components/DriveFolderViewContent';
import { DriveFolderViewModals } from '@features/drive/components/DriveFolderViewModals';
import { useDriveFolderView } from '@features/drive/hooks/use-drive-folder-view';
import { DriveScope } from '@features/drive/types/drive';

interface DriveFolderViewProps {
  scope: DriveScope;
  folderId?: string;
}

export const DriveFolderView: React.FC<DriveFolderViewProps> = ({ scope, folderId }) => {
  const view = useDriveFolderView(scope, folderId);

  if (view.children.isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <>
      <DriveFolderViewContent
        scope={scope}
        folderId={folderId}
        canMutate={view.canMutate}
        view={view}
      />
      <DriveFolderViewModals scope={scope} canMutate={view.canMutate} view={view} />
    </>
  );
};

export default DriveFolderView;
