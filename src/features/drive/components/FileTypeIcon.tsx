import React from 'react';
import { File, FileArchive, FileImage, FileSpreadsheet, FileText, FileVideo } from 'lucide-react';

interface FileTypeIconProps {
  mimeType: string;
  size?: number;
  className?: string;
}

export const FileTypeIcon: React.FC<FileTypeIconProps> = ({ mimeType, size = 20, className }) => {
  if (mimeType.startsWith('image/')) return <FileImage size={size} className={className} />;
  if (mimeType.startsWith('video/')) return <FileVideo size={size} className={className} />;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
    return <FileSpreadsheet size={size} className={className} />;
  }
  if (mimeType.includes('zip') || mimeType.includes('compressed')) {
    return <FileArchive size={size} className={className} />;
  }
  if (mimeType.includes('pdf') || mimeType.startsWith('text/')) {
    return <FileText size={size} className={className} />;
  }
  return <File size={size} className={className} />;
};

export default FileTypeIcon;
