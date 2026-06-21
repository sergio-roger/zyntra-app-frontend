import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AdminGuard } from './AdminGuard';
import { PermissionGuard } from './PermissionGuard';
import { useAuthStore } from '@features/auth/store/authStore';

vi.mock('@features/auth/store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('Guards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AdminGuard', () => {
    it('renders children if user role is admin', () => {
      vi.mocked(useAuthStore).mockImplementation((selector: any) => {
        const state = { user: { role: 'admin' } };
        return selector ? selector(state) : state;
      });

      render(
        <MemoryRouter initialEntries={['/settings/permissions']}>
          <Routes>
            <Route
              path="/settings/permissions"
              element={
                <AdminGuard>
                  <div>Admin Content</div>
                </AdminGuard>
              }
            />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('redirects to /settings/users if user is not admin', () => {
      vi.mocked(useAuthStore).mockImplementation((selector: any) => {
        const state = { user: { role: 'agent' } };
        return selector ? selector(state) : state;
      });

      render(
        <MemoryRouter initialEntries={['/settings/permissions']}>
          <Routes>
            <Route
              path="/settings/permissions"
              element={
                <AdminGuard>
                  <div>Admin Content</div>
                </AdminGuard>
              }
            />
            <Route path="/settings/users" element={<div>Redirect Target</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
      expect(screen.getByText('Redirect Target')).toBeInTheDocument();
    });
  });

  describe('PermissionGuard', () => {
    it('renders children if user is admin regardless of allowedMenus', () => {
      vi.mocked(useAuthStore).mockImplementation((selector: any) => {
        const state = {
          user: { role: 'admin' },
          allowedMenus: [],
        };
        return selector ? selector(state) : state;
      });

      render(
        <MemoryRouter initialEntries={['/crm/contacts']}>
          <Routes>
            <Route
              path="/crm/contacts"
              element={
                <PermissionGuard menuKey="crm_contacts">
                  <div>Contacts Content</div>
                </PermissionGuard>
              }
            />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Contacts Content')).toBeInTheDocument();
    });

    it('renders children if user has the menu key in allowedMenus', () => {
      vi.mocked(useAuthStore).mockImplementation((selector: any) => {
        const state = {
          user: { role: 'agent' },
          allowedMenus: [
            {
              key: 'crm',
              children: [{ key: 'crm_contacts' }],
            },
          ],
        };
        return selector ? selector(state) : state;
      });

      render(
        <MemoryRouter initialEntries={['/crm/contacts']}>
          <Routes>
            <Route
              path="/crm/contacts"
              element={
                <PermissionGuard menuKey="crm_contacts">
                  <div>Contacts Content</div>
                </PermissionGuard>
              }
            />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Contacts Content')).toBeInTheDocument();
    });

    it('redirects to /dashboard if user lacks menu key in allowedMenus', () => {
      vi.mocked(useAuthStore).mockImplementation((selector: any) => {
        const state = {
          user: { role: 'agent' },
          allowedMenus: [
            {
              key: 'crm',
              children: [], // No contacts permission
            },
          ],
        };
        return selector ? selector(state) : state;
      });

      render(
        <MemoryRouter initialEntries={['/crm/contacts']}>
          <Routes>
            <Route
              path="/crm/contacts"
              element={
                <PermissionGuard menuKey="crm_contacts">
                  <div>Contacts Content</div>
                </PermissionGuard>
              }
            />
            <Route path="/dashboard" element={<div>Dashboard Content</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.queryByText('Contacts Content')).not.toBeInTheDocument();
      expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
    });
  });
});
