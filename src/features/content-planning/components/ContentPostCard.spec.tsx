import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ContentPostCard } from '@features/content-planning/components/ContentPostCard';
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

describe('ContentPostCard', () => {
  it('shows the "Generar imagen" action when the post has no image yet', () => {
    renderWithClient(
      <ContentPostCard
        post={{
          id: 'post-1',
          planId: 'plan-1',
          platform: ContentPlanPlatform.FACEBOOK,
          scheduledAt: '2026-08-06T10:00:00.000Z',
          copyText: 'x',
          mediaType: 'image',
          imageUrl: null,
          status: ContentPostStatus.DRAFT,
        }}
      />,
    );

    expect(screen.getByText('Generar imagen')).toBeInTheDocument();
  });

  it('shows the disabled video placeholder when mediaType is video', () => {
    renderWithClient(
      <ContentPostCard
        post={{
          id: 'post-2',
          planId: 'plan-1',
          platform: ContentPlanPlatform.INSTAGRAM,
          scheduledAt: '2026-08-08T18:00:00.000Z',
          copyText: 'x',
          mediaType: 'video',
          imageUrl: null,
          status: ContentPostStatus.DRAFT,
        }}
      />,
    );

    expect(screen.getByText(/próximamente/i)).toBeInTheDocument();
  });

  it('shows the "Aprobar" action when the post already has an image', () => {
    renderWithClient(
      <ContentPostCard
        post={{
          id: 'post-3',
          planId: 'plan-1',
          platform: ContentPlanPlatform.FACEBOOK,
          scheduledAt: '2026-08-06T10:00:00.000Z',
          copyText: 'x',
          mediaType: 'image',
          imageUrl: 'https://example.com/img.png',
          status: ContentPostStatus.WITH_IMAGE,
        }}
      />,
    );

    expect(screen.getByText('Aprobar')).toBeInTheDocument();
  });
});
