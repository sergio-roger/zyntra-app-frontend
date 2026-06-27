import { create } from "zustand";

interface UiState {
  isUserMenuOpen: boolean;
  setUserMenuOpen: (isOpen: boolean) => void;
  toggleUserMenu: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isUserMenuOpen: false,
  setUserMenuOpen: (isOpen) => set({ isUserMenuOpen: isOpen }),
  toggleUserMenu: () =>
    set((state) => ({ isUserMenuOpen: !state.isUserMenuOpen })),
}));
