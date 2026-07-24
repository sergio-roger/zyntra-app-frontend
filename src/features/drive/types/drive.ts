export type DriveScope = 'me' | 'company';
export type DriveOwnerType = 'business' | 'user';
export type DriveSection = 'me' | 'company' | 'recent' | 'trash';

export interface DriveFolder {
  id: string;
  companyId: string;
  ownerType: DriveOwnerType;
  ownerId: string;
  parentId: string | null;
  name: string;
  path: string;
  isStarred: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DriveFile {
  id: string;
  companyId: string;
  module: string;
  entityId: string;
  bucket: string;
  objectKey: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  extension: string;
  size: number;
  checksum: string | null;
  folderId: string | null;
  ownerType: DriveOwnerType | null;
  ownerId: string | null;
  isStarred: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DriveFolderChildren {
  folderId: string;
  folders: DriveFolder[];
  files: DriveFile[];
}

export interface DriveBreadcrumbItem {
  id: string;
  name: string;
}

export interface DriveUploadResult {
  id: string;
  originalName: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

export interface CreateDriveFolderPayload {
  scope: DriveScope;
  name: string;
  parentId?: string;
}

export interface UpdateDriveFolderPayload {
  name?: string;
  parentId?: string | null;
}

export interface MoveOrRenameDriveFilePayload {
  originalName?: string;
  folderId?: string | null;
}

export interface ListDriveFilesOptions {
  trashed?: boolean;
  recent?: boolean;
}
