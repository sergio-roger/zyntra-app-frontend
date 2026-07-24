import React from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@shared/components/PageHeader';
import { DriveFlatView } from '@features/drive/components/DriveFlatView';
import { DriveFolderView } from '@features/drive/components/DriveFolderView';
import { DriveSidebar } from '@features/drive/components/DriveSidebar';
import { DriveSection } from '@features/drive/types/drive';

const SECTION_LABELS: Record<DriveSection, string> = {
  me: 'Mi unidad',
  company: 'Empresa',
  recent: 'Recientes',
  trash: 'Papelera',
};

const isDriveSection = (value: string | undefined): value is DriveSection =>
  !!value && value in SECTION_LABELS;

export const DrivePage: React.FC = () => {
  const { section: rawSection, folderId } = useParams<{ section: string; folderId: string }>();
  const section = isDriveSection(rawSection) ? rawSection : 'me';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader title="Drive" subtitle={`Archivos y carpetas · ${SECTION_LABELS[section]}`} />

      <div className="flex gap-6">
        <DriveSidebar />
        <div className="min-w-0 flex-1">
          {section === 'me' || section === 'company' ? (
            <DriveFolderView scope={section} folderId={folderId} />
          ) : (
            <DriveFlatView section={section} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DrivePage;
