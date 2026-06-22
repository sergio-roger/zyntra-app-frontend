import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { useAuthStore } from '@features/auth/store/authStore';

// Mock auth store
vi.mock('@features/auth/store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock subsidebar & siderail to keep tests focused on AppShell states
vi.mock('./SideRail', () => ({
  SideRail: ({ isSidebarOpen, onToggleSidebar }: any) => (
    <div data-testid="side-rail">
      SideRail Open: {isSidebarOpen ? 'true' : 'false'}
      <button onClick={() => onToggleSidebar(true)} data-testid="toggle-subsidebar-true">Open Sub</button>
      <button onClick={() => onToggleSidebar(false)} data-testid="toggle-subsidebar-false">Close Sub</button>
    </div>
  ),
}));

vi.mock('./SubSidebar', () => ({
  SubSidebar: ({ isOpen, onClose }: any) => (
    <div data-testid="sub-sidebar">
      SubSidebar Open: {isOpen ? 'true' : 'false'}
      <button onClick={onClose} data-testid="close-subsidebar">Close All</button>
    </div>
  ),
}));

describe('AppShell Layout Responsive States', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthStore).mockReturnValue({
      user: {
        role: 'manager',
        plan: { name: 'Pro' },
        plan_status: 'active',
      },
      allowedMenus: [],
    } as any);
  });

  it('renders AppShell layout and active plan badge in header', () => {
    render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>
    );

    expect(screen.getByText('Plan:')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('should toggle mobile menu when clicking hamburger button', () => {
    render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>
    );

    const hamburger = screen.getByRole('button', { name: /abrir navegación/i });
    
    // Initially mobile rail should be closed (SideRail Open: false)
    expect(screen.getByText('SideRail Open: false')).toBeInTheDocument();

    // Click hamburger to open SideRail
    fireEvent.click(hamburger);
    expect(screen.getByText('SideRail Open: true')).toBeInTheDocument();
    expect(screen.getByText('SubSidebar Open: false')).toBeInTheDocument(); // Only loads main menu, not sub-sidebar
  });

  it('should open subsidebar when a menu with children is clicked in SideRail', () => {
    render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>
    );

    const hamburger = screen.getByRole('button', { name: /abrir navegación/i });
    fireEvent.click(hamburger); // SideRail open: true, SubSidebar open: false

    // Click on toggle subsidebar (simulates selecting a module with sub-items)
    const openSubBtn = screen.getByTestId('toggle-subsidebar-true');
    fireEvent.click(openSubBtn);

    expect(screen.getByText('SideRail Open: true')).toBeInTheDocument();
    expect(screen.getByText('SubSidebar Open: true')).toBeInTheDocument();
  });

  it('should close everything when clicking the mobile overlay', () => {
    render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>
    );

    const hamburger = screen.getByRole('button', { name: /abrir navegación/i });
    fireEvent.click(hamburger);

    // SideRail should be open
    expect(screen.getByText('SideRail Open: true')).toBeInTheDocument();

    // Overlay is rendered now
    const overlay = document.querySelector('.bg-black\\/60');
    expect(overlay).not.toBeNull();

    // Click overlay to close
    if (overlay) fireEvent.click(overlay);
    expect(screen.getByText('SideRail Open: false')).toBeInTheDocument();
    expect(screen.getByText('SubSidebar Open: false')).toBeInTheDocument();
  });
});
