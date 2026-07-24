import api from '@shared/api/axios';
import { ApiResponse, unwrap } from '@core/types/api';
import {
  CreateDriveFolderPayload,
  DriveBreadcrumbItem,
  DriveFile,
  DriveFolder,
  DriveFolderChildren,
  DriveScope,
  DriveUploadResult,
  ListDriveFilesOptions,
  MoveOrRenameDriveFilePayload,
  UpdateDriveFolderPayload,
} from '@features/drive/types/drive';

const base = (businessId: string) => `/businesses/${businessId}/drive`;

export const driveApi = {
  listChildren: (
    businessId: string,
    scope: DriveScope,
    folderId?: string,
  ): Promise<DriveFolderChildren> =>
    api
      .get<unknown, ApiResponse<DriveFolderChildren>>(
        `${base(businessId)}/folders${folderId ? `/${folderId}` : ''}`,
        { params: { scope } },
      )
      .then(unwrap),

  getBreadcrumb: (
    businessId: string,
    folderId: string,
  ): Promise<DriveBreadcrumbItem[]> =>
    api
      .get<unknown, ApiResponse<DriveBreadcrumbItem[]>>(
        `${base(businessId)}/folders/${folderId}/breadcrumb`,
      )
      .then(unwrap),

  createFolder: (
    businessId: string,
    payload: CreateDriveFolderPayload,
  ): Promise<DriveFolder> =>
    api
      .post<unknown, ApiResponse<DriveFolder>>(
        `${base(businessId)}/folders`,
        payload,
      )
      .then(unwrap),

  updateFolder: (
    businessId: string,
    folderId: string,
    payload: UpdateDriveFolderPayload,
  ): Promise<DriveFolder> =>
    api
      .patch<unknown, ApiResponse<DriveFolder>>(
        `${base(businessId)}/folders/${folderId}`,
        payload,
      )
      .then(unwrap),

  deleteFolder: (businessId: string, folderId: string): Promise<void> =>
    api
      .delete<unknown, ApiResponse<void>>(`${base(businessId)}/folders/${folderId}`)
      .then(unwrap),

  uploadFile: (
    businessId: string,
    scope: DriveScope,
    folderId: string | undefined,
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<DriveUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('scope', scope);
    if (folderId) formData.append('folderId', folderId);

    return api
      .post<unknown, ApiResponse<DriveUploadResult>>(`${base(businessId)}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (!onProgress || !event.total) return;
          onProgress(Math.round((event.loaded / event.total) * 100));
        },
      })
      .then(unwrap);
  },

  listFiles: (
    businessId: string,
    scope: DriveScope,
    options: ListDriveFilesOptions = {},
  ): Promise<DriveFile[]> =>
    api
      .get<unknown, ApiResponse<DriveFile[]>>(`${base(businessId)}/files`, {
        params: { scope, ...options },
      })
      .then(unwrap),

  moveOrRenameFile: (
    businessId: string,
    fileId: string,
    payload: MoveOrRenameDriveFilePayload,
  ): Promise<DriveFile> =>
    api
      .patch<unknown, ApiResponse<DriveFile>>(
        `${base(businessId)}/files/${fileId}`,
        payload,
      )
      .then(unwrap),

  deleteFile: (businessId: string, fileId: string): Promise<void> =>
    api
      .delete<unknown, ApiResponse<void>>(`${base(businessId)}/files/${fileId}`)
      .then(unwrap),

  restoreFile: (businessId: string, fileId: string): Promise<DriveFile> =>
    api
      .post<unknown, ApiResponse<DriveFile>>(
        `${base(businessId)}/files/${fileId}/restore`,
      )
      .then(unwrap),

  permanentlyDeleteFile: (businessId: string, fileId: string): Promise<void> =>
    api
      .delete<unknown, ApiResponse<void>>(
        `${base(businessId)}/files/${fileId}/permanent`,
      )
      .then(unwrap),

  getPreviewUrl: (businessId: string, fileId: string): Promise<string> =>
    api
      .get<unknown, ApiResponse<string>>(
        `${base(businessId)}/files/${fileId}/preview-url`,
      )
      .then(unwrap),

  getDownloadUrl: (businessId: string, fileId: string): string =>
    `${api.defaults.baseURL}${base(businessId)}/files/${fileId}/download`,
};
