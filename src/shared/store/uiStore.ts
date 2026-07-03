import { create } from "zustand";

interface UiState {
  isUserMenuOpen: boolean;
  setUserMenuOpen: (isOpen: boolean) => void;
  toggleUserMenu: () => void;
  openGroups: string[];
  toggleGroup: (key: string) => void;
  setOpenGroups: (keys: string[]) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isUserMenuOpen: false,
  setUserMenuOpen: (isOpen) => set({ isUserMenuOpen: isOpen }),
  toggleUserMenu: () =>
    set((state) => ({ isUserMenuOpen: !state.isUserMenuOpen })),
  openGroups: ["settings_general"],
  toggleGroup: (key) =>
    set((state) => ({
      openGroups: state.openGroups.includes(key)
        ? state.openGroups.filter((g) => g !== key)
        : [...state.openGroups, key],
    })),
  setOpenGroups: (keys) => set({ openGroups: keys }),
}));
