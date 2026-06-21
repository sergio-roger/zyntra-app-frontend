import { User, MenuNode } from '@features/auth/types/auth.types';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  allowedMenus: MenuNode[] | null;

  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setAllowedMenus: (menus: MenuNode[] | null) => void;
  logout: () => void;
}
