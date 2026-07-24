import {
  useCreateDriveFolder,
  useDeleteDriveFolder,
  useDriveChildren,
  useUpdateDriveFolder,
} from '@features/drive/hooks/use-drive-folders';
import {
  useDeleteDriveFile,
  useMoveOrRenameDriveFile,
  useUploadDriveFile,
} from '@features/drive/hooks/use-drive-files';
import { DriveScope } from '@features/drive/types/drive';

export function useDriveFolderViewMutations(scope: DriveScope, folderId?: string) {
  return {
    children: useDriveChildren(scope, folderId),
    createFolder: useCreateDriveFolder(),
    updateFolder: useUpdateDriveFolder(),
    deleteFolder: useDeleteDriveFolder(),
    uploadFile: useUploadDriveFile(),
    moveOrRenameFile: useMoveOrRenameDriveFile(),
    deleteFile: useDeleteDriveFile(),
  };
}

export type DriveFolderViewMutations = ReturnType<typeof useDriveFolderViewMutations>;
