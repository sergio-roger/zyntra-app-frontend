import { useAuthStore } from '@features/auth/store/authStore';
import { useDriveFolderViewCrud } from '@features/drive/hooks/use-drive-folder-view-crud';
import { useDriveFolderViewHandlers } from '@features/drive/hooks/use-drive-folder-view-handlers';
import { useDriveFolderViewMutations } from '@features/drive/hooks/use-drive-folder-view-mutations';
import { useDriveFolderViewState } from '@features/drive/hooks/use-drive-folder-view-state';
import { DriveScope } from '@features/drive/types/drive';
import { canMutateCompanyScope } from '@features/drive/utils/permissions';

export function useDriveFolderView(scope: DriveScope, folderId?: string) {
  const role = useAuthStore((s) => s.user?.role);
  const canMutate = scope === 'me' || canMutateCompanyScope(role);

  const state = useDriveFolderViewState();
  const mutations = useDriveFolderViewMutations(scope, folderId);
  const handlers = useDriveFolderViewHandlers(scope, folderId, state, mutations);
  const crud = useDriveFolderViewCrud(state, mutations, handlers.moveById);

  return { canMutate, ...state, ...mutations, ...handlers, ...crud };
}

export type DriveFolderView = ReturnType<typeof useDriveFolderView>;
