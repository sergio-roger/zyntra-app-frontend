import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ContentPlanDayPanel } from '@features/content-planning/components/ContentPlanDayPanel';
import { ContentPlanPlatform } from '@features/content-planning/enums/content-plan-platform.enum';
import { ContentPostStatus } from '@features/content-planning/enums/content-post-status.enum';

vi.mock('@features/auth/store/authStore', () => {
  const state = { user: { businessId: 'biz-1' } };
  const useAuthStore = (selector?: (s: typeof state) => unknown) =>
    selector ? selector(state) : state;
  return { useAuthStore };
});

vi.mock('@features/content-planning/hooks/use-approve-post', () => ({
  useApprovePost: () => ({ mutate: vi.fn() }),
}));

const renderWithClient = (ui: React.ReactElement) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
};

describe('ContentPlanDayPanel', () => {
  it('renders one ContentPostCard per post and calls onClose on the close button', () => {
    const onClose = vi.fn();
    renderWithClient(
      <ContentPlanDayPanel
        date="2026-08-04"
        posts={[
          {
            id: 'post-1',
            planId: 'plan-1',
            platform: ContentPlanPlatform.INSTAGRAM,
            scheduledAt: '2026-08-04T13:00:00.000Z',
            copyText: 'x',
            mediaType: 'image',
            imageUrl: null,
            status: ContentPostStatus.DRAFT,
          },
        ]}
        onClose={onClose}
      />,
    );

    expect(screen.getByText('Generar imagen')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Cerrar'));
    expect(onClose).toHaveBeenCalled();
  });
});
