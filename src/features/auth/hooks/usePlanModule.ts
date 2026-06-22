import { useAuthStore } from '@features/auth/store/authStore';
import { MenuNode, ModuleAccessLevel } from '@features/auth/types/auth.types';

function findNode(nodes: MenuNode[], key: string): MenuNode | null {
  for (const node of nodes) {
    if (node.key === key) return node;
    if (node.children?.length) {
      const found = findNode(node.children, key);
      if (found) return found;
    }
  }
  return null;
}

export function usePlanModule(menuKey: string) {
  const menus = useAuthStore((s) => s.allowedMenus);

  const node = menus ? findNode(menus, menuKey) : null;

  // If the menu node isn't in the allowed list at all → locked
  const level: ModuleAccessLevel = node?.access_level ?? (node ? 'full' : 'locked');

  return {
    accessLevel: level,
    isFull: level === 'full',
    isReadOnly: level === 'read_only',
    isLocked: level === 'locked',
  };
}
