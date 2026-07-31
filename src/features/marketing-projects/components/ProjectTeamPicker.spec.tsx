import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { ProjectTeamPicker } from '@features/marketing-projects/components/ProjectTeamPicker';
import api from '@shared/api/axios';
import { MarketingProjectMemberType } from '@features/marketing-projects/enums/marketing-project-member-type.enum';

vi.mock('@shared/api/axios', () => ({
  default: { get: vi.fn() },
}));

vi.mock('@features/auth/store/authStore', () => {
  const state = { user: { businessId: 'biz-1' } };
  const useAuthStore = (selector?: (s: typeof state) => unknown) =>
    selector ? selector(state) : state;
  return { useAuthStore };
});

describe('ProjectTeamPicker', () => {
  it('lists users and agents combined and calls onChange when one is selected', async () => {
    vi.mocked(api.get).mockImplementation((url: string) => {
      if (url === '/settings/users') {
        return Promise.resolve({ data: [{ id: 'user-1', name: 'Ana', avatarUrl: null }] });
      }
      return Promise.resolve({
        data: [{ importedAt: '', systemAgent: { id: 'agent-1', name: 'Support Agent', avatarUrl: null } }],
      });
    });

    const onChange = vi.fn();
    render(<ProjectTeamPicker value={[]} onChange={onChange} />);

    fireEvent.click(screen.getByText('Seleccionar...'));

    await waitFor(() => expect(screen.getByText('Ana')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Ana'));

    expect(onChange).toHaveBeenCalledWith([
      { memberType: MarketingProjectMemberType.USER, memberId: 'user-1', name: 'Ana' },
    ]);
  });
});
