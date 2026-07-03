import { authApi } from "@features/auth/api/authApi";
import { useAuthStore } from "@features/auth/store/authStore";
import {
  ChangePasswordInput,
  UpdateProfileInput,
} from "@features/auth/types/auth.types";
import { toastManager } from "@shared/components/toast/toastManager";
import { getApiErrorMessage } from "@shared/constants/apiErrors";
import { useMutation } from "@tanstack/react-query";

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => authApi.updateProfile(data),
    onSuccess: (response) => {
      setUser(response.data);
      toastManager.add({
        title: "Perfil actualizado",
        description: "Tus datos se guardaron correctamente.",
        type: "success",
      });
    },
    onError: (error) => {
      toastManager.add({
        title: "Error al actualizar el perfil",
        description: getApiErrorMessage(error),
        type: "error",
      });
    },
  });
}

export function useUploadAvatar() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (file: File) => authApi.uploadAvatar(file),
    onSuccess: (response) => {
      const current = useAuthStore.getState().user;
      if (current) {
        setUser({ ...current, avatarUrl: response.data.avatarUrl });
      }
      toastManager.add({
        title: "Avatar actualizado",
        description: "Tu foto de perfil se actualizó correctamente.",
        type: "success",
      });
    },
    onError: (error) => {
      toastManager.add({
        title: "Error al subir el avatar",
        description: getApiErrorMessage(error),
        type: "error",
      });
    },
  });
}

export function useRemoveAvatar() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: () => authApi.removeAvatar(),
    onSuccess: () => {
      const current = useAuthStore.getState().user;
      if (current) {
        setUser({ ...current, avatarUrl: null });
      }
      toastManager.add({
        title: "Avatar eliminado",
        description: "Tu foto de perfil se eliminó correctamente.",
        type: "success",
      });
    },
    onError: (error) => {
      toastManager.add({
        title: "Error al eliminar el avatar",
        description: getApiErrorMessage(error),
        type: "error",
      });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordInput) => authApi.changePassword(data),
    onSuccess: () => {
      toastManager.add({
        title: "Contraseña actualizada",
        description: "Tu contraseña se cambió correctamente.",
        type: "success",
      });
    },
    onError: (error) => {
      toastManager.add({
        title: "Error al cambiar la contraseña",
        description: getApiErrorMessage(error),
        type: "error",
      });
    },
  });
}
