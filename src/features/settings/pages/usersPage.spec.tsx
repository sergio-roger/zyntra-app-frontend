import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { UsersPage } from "./UsersPage";
import { useAuthStore } from "@features/auth/store/authStore";
import * as useUsersTeamsHook from "../hooks/useUsersTeams";
import { toastManager } from "@shared/components/toast/toastManager";

vi.mock("../hooks/useUsersTeams", () => ({
  useUsersList: vi.fn(),
  useUpdateUser: vi.fn(),
  useCreateUser: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}));

vi.mock("@features/auth/store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("@features/settings/hooks/usePermissions", () => ({
  useRolesList: vi.fn(() => ({
    data: [
      { id: "admin-id", name: "admin", label: "Administrador" },
      { id: "manager-id", name: "manager", label: "Gerente" },
      { id: "agent-id", name: "agent", label: "Agente" },
    ],
    isLoading: false,
  })),
  useCreateRole: vi.fn(),
  useUpdateRole: vi.fn(),
  useDeleteRole: vi.fn(),
  useMenusList: vi.fn(),
  useRolePermissions: vi.fn(),
  useUpdatePermissions: vi.fn(),
}));

vi.mock("@shared/components/toast/toastManager", () => ({
  toastManager: {
    add: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("UsersPage - User Limits", () => {
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUsersTeamsHook.useUpdateUser).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as any);
  });

  it("should allow adding/activating users when count is less than the limit", () => {
    // Mock user with a limit of 3
    vi.mocked(useAuthStore).mockImplementation((selector: any) => {
      const state = { user: { plan: { name: "Impulse Pro", user_limit: 3 } } };
      return selector ? selector(state) : state;
    });

    // Currently 2 active users (less than limit) and 1 inactive user
    const mockUsers = [
      {
        id: "1",
        name: "User One",
        email: "one@test.com",
        role: "admin",
        is_active: true,
        teams: [],
      },
      {
        id: "2",
        name: "User Two",
        email: "two@test.com",
        role: "agent",
        is_active: true,
        teams: [],
      },
      {
        id: "3",
        name: "User Three",
        email: "three@test.com",
        role: "agent",
        is_active: false,
        teams: [],
      },
    ];

    vi.mocked(useUsersTeamsHook.useUsersList).mockReturnValue({
      data: mockUsers,
      isLoading: false,
      isError: false,
    } as any);

    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>,
      { wrapper: createWrapper() },
    );

    // Verify "Añadir usuario" button is active/enabled
    const addButton = screen.getByRole("button", { name: /Añadir usuario/i });
    expect(addButton).not.toBeDisabled();

    // Verify warning banner is not present
    expect(
      screen.queryByText(/Has alcanzado el límite/i),
    ).not.toBeInTheDocument();

    // Try to activate the inactive user (third user)
    const activateButtons = screen.getAllByRole("button");
    // The status toggle button for the inactive user has title "Activar" or is the one with UserCheck icon
    // Let's click it: it triggers toggleStatus
    const inactiveUserToggle = activateButtons.find(
      (btn) => btn.title === "Activar",
    );
    expect(inactiveUserToggle).toBeDefined();

    fireEvent.click(inactiveUserToggle!);

    // Should call mutateAsync to activate user
    expect(mockMutateAsync).toHaveBeenCalledWith({
      id: "3",
      status: "active",
      isActive: true,
      is_active: true,
    });
    expect(toastManager.add).not.toHaveBeenCalled();
  });

  it("should block adding/activating users when count equals the limit", () => {
    // Mock user with a limit of 2
    vi.mocked(useAuthStore).mockImplementation((selector: any) => {
      const state = { user: { plan: { name: "Impulse Pro", user_limit: 2 } } };
      return selector ? selector(state) : state;
    });

    // Currently 2 active users (equals limit) and 1 inactive user
    const mockUsers = [
      {
        id: "1",
        name: "User One",
        email: "one@test.com",
        role: "admin",
        is_active: true,
        teams: [],
      },
      {
        id: "2",
        name: "User Two",
        email: "two@test.com",
        role: "agent",
        is_active: true,
        teams: [],
      },
      {
        id: "3",
        name: "User Three",
        email: "three@test.com",
        role: "agent",
        is_active: false,
        teams: [],
      },
    ];

    vi.mocked(useUsersTeamsHook.useUsersList).mockReturnValue({
      data: mockUsers,
      isLoading: false,
      isError: false,
    } as any);

    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>,
      { wrapper: createWrapper() },
    );

    // Verify "Añadir usuario" button is disabled
    const addButton = screen.getByRole("button", { name: /Añadir usuario/i });
    expect(addButton).toBeDisabled();

    // Verify warning banner is present
    expect(
      screen.getByText(/Has alcanzado el límite de 2 usuarios activos/i),
    ).toBeInTheDocument();

    // Try to activate the inactive user (third user)
    const activateButtons = screen.getAllByRole("button");
    const inactiveUserToggle = activateButtons.find(
      (btn) => btn.title === "Activar",
    );
    expect(inactiveUserToggle).toBeDefined();

    fireEvent.click(inactiveUserToggle!);

    // Should NOT call mutateAsync, but show an error toast instead
    expect(mockMutateAsync).not.toHaveBeenCalled();
    expect(toastManager.add).toHaveBeenCalledWith({
      title: "Límite alcanzado",
      description:
        "Has alcanzado el límite de 2 usuarios activos permitidos en tu plan.",
      type: "error",
    });
  });

  it('should display "1 / 10" when plan is Core Digital with a limit of 10', () => {
    vi.mocked(useAuthStore).mockImplementation((selector: any) => {
      const state = {
        user: { plan: { name: "Core Digital", user_limit: 10 } },
      };
      return selector ? selector(state) : state;
    });

    const mockUsers = [
      {
        id: "1",
        name: "User One",
        email: "one@test.com",
        role: "admin",
        is_active: true,
        teams: [],
      },
    ];

    vi.mocked(useUsersTeamsHook.useUsersList).mockReturnValue({
      data: mockUsers,
      isLoading: false,
      isError: false,
    } as any);

    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>,
      { wrapper: createWrapper() },
    );

    // Verify counter shows "1 / 10"
    const counterDiv = screen.getByText(/activos/i);
    expect(counterDiv.textContent).toContain("1 / 10");

    // Verify button is enabled
    const addButton = screen.getByRole("button", { name: /Añadir usuario/i });
    expect(addButton).not.toBeDisabled();
  });
});
