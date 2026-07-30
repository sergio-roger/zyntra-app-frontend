import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ContentPlanKanbanView } from '@features/content-planning/components/ContentPlanKanbanView';
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

describe('ContentPlanKanbanView', () => {
  it('groups posts into columns by status', () => {
    renderWithClient(
      <ContentPlanKanbanView
        posts={[
          { id: 'post-1', planId: 'plan-1', platform: ContentPlanPlatform.INSTAGRAM, scheduledAt: '2026-08-04T13:00:00.000Z', copyText: 'a', mediaType: 'image', imageUrl: null, status: ContentPostStatus.DRAFT },
          { id: 'post-2', planId: 'plan-1', platform: ContentPlanPlatform.FACEBOOK, scheduledAt: '2026-08-05T13:00:00.000Z', copyText: 'b', mediaType: 'image', imageUrl: 'https://x/img.png', status: ContentPostStatus.APPROVED },
        ]}
      />,
    );

    expect(screen.getByText('Borrador')).toBeInTheDocument();
    expect(screen.getByText('Aprobado')).toBeInTheDocument();
    expect(screen.getAllByText(/^a$|^b$/)).toHaveLength(2);
  });
});
