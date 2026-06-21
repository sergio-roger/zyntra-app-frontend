import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { useAuth } from "../hooks/useAuth";
import { toastManager } from "../../../shared/components/toast/toastManager";

// Mock hook
vi.mock("../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

// Mock toast manager
vi.mock("../../../shared/components/toast/toastManager", () => ({
  toastManager: {
    add: vi.fn(),
  },
}));

describe("LoginForm", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
    } as unknown as ReturnType<typeof useAuth>);
  });

  it("should render email and password inputs and a submit button", () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /iniciar sesión/i }),
    ).toBeInTheDocument();
  });

  it("should show validation errors when fields are empty and form is submitted", async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/El email es requerido/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/La contraseña es requerida/i),
      ).toBeInTheDocument();
    });
  });

  it("should call login function and show success toast when valid credentials are submitted", async () => {
    mockLogin.mockResolvedValueOnce({ user: { email: "test@example.com" } });
    const successCallback = vi.fn();

    render(
      <MemoryRouter>
        <LoginForm onSuccess={successCallback} />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(toastManager.add).toHaveBeenCalledWith({
        title: "¡Bienvenido!",
        description: "Sesión iniciada correctamente.",
        type: "success",
      });
      expect(successCallback).toHaveBeenCalled();
    });
  });

  it("should show error toast when login fails", async () => {
    mockLogin.mockRejectedValueOnce({
      response: {
        data: {
          message: "Credenciales inválidas",
        },
      },
    });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(toastManager.add).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
        }),
      );
    });
  });
});
