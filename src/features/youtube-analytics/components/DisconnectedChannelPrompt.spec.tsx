import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DisconnectedChannelPrompt } from '@features/youtube-analytics/components/DisconnectedChannelPrompt';

const useVideoInterestsMock = vi.fn();
const mutateAsyncMock = vi.fn().mockResolvedValue(undefined);

vi.mock('@features/youtube-analytics/hooks/useVideoInterests', () => ({
  useVideoInterests: () => useVideoInterestsMock(),
  useSaveVideoInterestSelection: () => ({
    mutateAsync: mutateAsyncMock,
    isPending: false,
  }),
}));

function renderPrompt() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <DisconnectedChannelPrompt />
    </QueryClientProvider>,
  );
}

describe('DisconnectedChannelPrompt', () => {
  beforeEach(() => {
    useVideoInterestsMock.mockReturnValue({
      data: [
        { id: '1', slug: 'gaming', name: 'Gaming' },
        { id: '2', slug: 'fitness', name: 'Fitness' },
        { id: '3', slug: 'cocina', name: 'Cocina' },
        { id: '4', slug: 'viajes', name: 'Viajes' },
      ],
    });
    mutateAsyncMock.mockClear();
  });

  it('disables the connect button with fewer than 3 interests selected', () => {
    renderPrompt();

    fireEvent.click(screen.getByText('Gaming'));
    fireEvent.click(screen.getByText('Fitness'));

    expect(screen.getByText('Conectar con Google')).toBeDisabled();
  });

  it('enables the connect button once 3 interests are selected', () => {
    renderPrompt();

    fireEvent.click(screen.getByText('Gaming'));
    fireEvent.click(screen.getByText('Fitness'));
    fireEvent.click(screen.getByText('Cocina'));

    expect(screen.getByText('Conectar con Google')).not.toBeDisabled();
  });

  it('saves the selection before redirecting to connect', async () => {
    renderPrompt();

    fireEvent.click(screen.getByText('Gaming'));
    fireEvent.click(screen.getByText('Fitness'));
    fireEvent.click(screen.getByText('Cocina'));
    fireEvent.click(screen.getByText('Conectar con Google'));

    await vi.waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith(['1', '2', '3']);
    });
  });
});
