import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MyAccountPage } from './MyAccountPage';
import { authApi } from '@features/auth/api/authApi';
import { toastManager } from '@shared/components/toast/toastManager';

vi.mock('@features/auth/api/authApi', () => ({
  authApi: {
    updateProfile: vi.fn(),
    uploadAvatar: vi.fn(),
    removeAvatar: vi.fn(),
    changePassword: vi.fn(),
  },
}));

vi.mock('../../../shared/components/toast/toastManager', () => ({
  toastManager: { add: vi.fn() },
}));

const authState = vi.hoisted(() => ({
  user: null as Record<string, unknown> | null,
  setUser: vi.fn(),
}));

vi.mock('@features/auth/store/authStore', () => {
  const useAuthStore = (selector?: (state: typeof authState) => unknown) =>
    selector ? selector(authState) : authState;
  (useAuthStore as unknown as { getState: () => typeof authState }).getState =
    () => authState;
  return { useAuthStore };
});

const mockUser = {
  id: 'biz-1',
  name: 'Ana Gomez',
  firstName: 'Ana',
  lastName: 'Gomez',
  email: 'ana@zyntra.com',
  role: 'agent',
  plan: null,
  plan_status: 'active',
  crm_user_id: 'crm-1',
  avatarUrl: null,
  jobTitle: 'Agente de Ventas',
  isAccountActivated: true,
  createdAt: '2026-01-15T00:00:00.000Z',
};

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MyAccountPage />
    </QueryClientProvider>,
  );
}

describe('MyAccountPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user = { ...mockUser };
    authState.setUser = vi.fn();
  });

  it('renders the current user data in the profile fields', () => {
    renderPage();

    expect(screen.getByDisplayValue('Ana')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Gomez')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Agente de Ventas')).toBeInTheDocument();
    expect(screen.getByText('ana@zyntra.com')).toBeInTheDocument();
  });

  it('submits only the changed profile fields and shows a success toast', async () => {
    vi.mocked(authApi.updateProfile).mockResolvedValueOnce({
      data: { ...mockUser, firstName: 'Anita' },
    } as never);

    renderPage();

    fireEvent.change(screen.getByDisplayValue('Ana'), {
      target: { value: 'Anita' },
    });
    fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

    await waitFor(() => {
      expect(authApi.updateProfile).toHaveBeenCalledWith({
        firstName: 'Anita',
      });
      expect(toastManager.add).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' }),
      );
    });
  });

  it('shows a validation error and does not call the API when the avatar format is invalid', async () => {
    renderPage();

    const file = new File(['not an image'], 'malicious.txt', {
      type: 'text/plain',
    });
    fireEvent.change(screen.getByLabelText(/subir avatar/i), {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(toastManager.add).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
    });
    expect(authApi.uploadAvatar).not.toHaveBeenCalled();
  });

  it('shows an error and does not call the API when newPassword and confirmPassword differ', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /^seguridad$/i }));

    fireEvent.change(screen.getByLabelText(/contraseña actual/i), {
      target: { value: 'OldPassword1' },
    });
    fireEvent.change(screen.getByLabelText(/^nueva contraseña$/i), {
      target: { value: 'NewPassword1' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar nueva contraseña/i), {
      target: { value: 'Mismatch1' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: /cambiar contraseña/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(/las contraseñas no coinciden/i),
      ).toBeInTheDocument();
    });
    expect(authApi.changePassword).not.toHaveBeenCalled();
  });

  it('clears the password fields and shows a success toast on successful submit', async () => {
    vi.mocked(authApi.changePassword).mockResolvedValueOnce({
      message: 'ok',
    } as never);

    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /^seguridad$/i }));

    fireEvent.change(screen.getByLabelText(/contraseña actual/i), {
      target: { value: 'OldPassword1' },
    });
    fireEvent.change(screen.getByLabelText(/^nueva contraseña$/i), {
      target: { value: 'NewPassword1' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar nueva contraseña/i), {
      target: { value: 'NewPassword1' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: /cambiar contraseña/i }),
    );

    await waitFor(() => {
      expect(authApi.changePassword).toHaveBeenCalledWith({
        currentPassword: 'OldPassword1',
        newPassword: 'NewPassword1',
      });
      expect(toastManager.add).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' }),
      );
    });

    await waitFor(() => {
      expect(
        (screen.getByLabelText(/contraseña actual/i) as HTMLInputElement)
          .value,
      ).toBe('');
    });
  });

  it('shows the error message and keeps the form filled when the API rejects the request', async () => {
    vi.mocked(authApi.changePassword).mockRejectedValueOnce({
      response: { data: { message: 'Contraseña actual incorrecta' } },
    });

    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /^seguridad$/i }));

    fireEvent.change(screen.getByLabelText(/contraseña actual/i), {
      target: { value: 'WrongPassword1' },
    });
    fireEvent.change(screen.getByLabelText(/^nueva contraseña$/i), {
      target: { value: 'NewPassword1' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar nueva contraseña/i), {
      target: { value: 'NewPassword1' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: /cambiar contraseña/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText('Contraseña actual incorrecta'),
      ).toBeInTheDocument();
    });
    expect(
      (screen.getByLabelText(/contraseña actual/i) as HTMLInputElement).value,
    ).toBe('WrongPassword1');
  });
});
