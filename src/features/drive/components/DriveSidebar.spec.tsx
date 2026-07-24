import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DriveSidebar } from '@features/drive/components/DriveSidebar';

describe('DriveSidebar', () => {
  it('renders the four drive sections', () => {
    render(
      <MemoryRouter initialEntries={['/drive/me']}>
        <DriveSidebar />
      </MemoryRouter>,
    );
    expect(screen.getByText('Mi unidad')).toBeInTheDocument();
    expect(screen.getByText('Empresa')).toBeInTheDocument();
    expect(screen.getByText('Recientes')).toBeInTheDocument();
    expect(screen.getByText('Papelera')).toBeInTheDocument();
  });

  it('marks the active section link', () => {
    render(
      <MemoryRouter initialEntries={['/drive/company']}>
        <DriveSidebar />
      </MemoryRouter>,
    );
    expect(screen.getByText('Empresa').closest('a')).toHaveClass('text-primary');
  });
});
