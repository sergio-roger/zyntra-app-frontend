import { DriveFile, DriveFolder } from '@features/drive/types/drive';

export type DriveListItem =
  | { kind: 'folder'; data: DriveFolder }
  | { kind: 'file'; data: DriveFile };

export const DRIVE_DND_MIME_TYPE = 'application/x-zyntra-drive-item';

export interface DriveDragPayload {
  kind: 'folder' | 'file';
  id: string;
}
