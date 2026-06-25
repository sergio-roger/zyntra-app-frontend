import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { DealsKanban } from '@crm/components/DealsKanban';
import { useKanbanStore } from '@crm/store/kanbanStore';
import * as dealsApiModule from '@crm/api/deals.api';
import { KanbanResponse, Deal, DealPipelineStage, DealPipeline } from '@crm/types/crm';

// ─── Mocks ───────────────────────────────────────────────────────────────────

// dnd-kit does not work in jsdom. We mock the DndContext and expose a ref to
// the onDragEnd handler so we can call it programmatically.
let capturedOnDragEnd: ((e: any) => void) | null = null;

vi.mock('@dnd-kit/core', async (importOriginal) => {
  const real = await importOriginal<Record<string, unknown>>();
  return {
    ...real,
    DndContext: ({ children, onDragEnd }: any) => {
      capturedOnDragEnd = onDragEnd;
      return <>{children}</>;
    },
    DragOverlay: ({ children }: any) => <>{children}</>,
    useSensor: vi.fn(),
    useSensors: vi.fn(() => []),
    useDroppable: vi.fn(() => ({ setNodeRef: vi.fn(), isOver: false })),
    useDraggable: vi.fn(() => ({
      attributes: {},
      listeners: {},
      setNodeRef: vi.fn(),
      transform: null,
      isDragging: false,
    })),
  };
});

vi.mock('@crm/api/deals.api', () => ({
  dealsApi: {
    update: vi.fn(),
  },
}));

vi.mock('@shared/components/toast/toastManager', () => ({
  toastManager: { add: vi.fn() },
}));

// ─── Fixtures ────────────────────────────────────────────────────────────────

const makeStage = (overrides: Partial<DealPipelineStage> = {}): DealPipelineStage => ({
  id: 'stage-prospección',
  name: 'Prospección',
  color: '#4f46e5',
  position: 0,
  type: 'active',
  probability_percent: 10,
  pipeline_id: 'pipe-1',
  ...overrides,
});

const makeDeal = (overrides: Partial<Deal> = {}): Deal => ({
  id: 'deal-1',
  title: 'Test Deal',
  value: 1000,
  currency: 'COP',
  status: 'open',
  pipeline_id: 'pipe-1',
  stage_id: 'stage-prospección',
  contact_id: 'contact-1',
  contact: { id: 'contact-1', name: 'Cliente Test' } as any,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

const stageA = makeStage({ id: 'stage-prospección', name: 'Prospección', position: 0 });
const stageB = makeStage({ id: 'stage-contactado', name: 'Contactado', position: 1 });

const makePipeline = (): DealPipeline => ({
  id: 'pipe-1',
  name: 'Pipeline Principal',
  is_default: true,
  position: 0,
  stages: [stageA, stageB],
  business_id: 'biz-1',
});

const makeKanbanData = (dealStageId = 'stage-prospección'): KanbanResponse => ({
  pipeline: makePipeline(),
  columns: [
    {
      stage: stageA,
      deals: dealStageId === 'stage-prospección' ? [makeDeal({ stage_id: 'stage-prospección' })] : [],
      total_value: dealStageId === 'stage-prospección' ? 1000 : 0,
    },
    {
      stage: stageB,
      deals: dealStageId === 'stage-contactado' ? [makeDeal({ stage_id: 'stage-contactado' })] : [],
      total_value: dealStageId === 'stage-contactado' ? 1000 : 0,
    },
  ],
});

// ─── Test helpers ─────────────────────────────────────────────────────────────

const createWrapper = () => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return { qc, Wrapper };
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DealsKanban — drag-and-drop', () => {
  const updateMock = dealsApiModule.dealsApi.update as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    capturedOnDragEnd = null;
    // Reset Zustand store between tests
    useKanbanStore.setState({ pendingMoves: {} });
  });

  it('calls the PATCH API with the correct stage_id when a deal is dropped', async () => {
    updateMock.mockResolvedValue({ data: { id: 'deal-1', stage_id: 'stage-contactado' } });

    const { Wrapper } = createWrapper();
    const kanbanData = makeKanbanData('stage-prospección');

    render(
      <Wrapper>
        <DealsKanban kanbanData={kanbanData} />
      </Wrapper>,
    );

    expect(capturedOnDragEnd).not.toBeNull();

    await act(async () => {
      capturedOnDragEnd!({
        active: { id: 'deal-1' },
        over: { id: 'stage-contactado' },
      });
    });

    expect(updateMock).toHaveBeenCalledTimes(1);
    expect(updateMock).toHaveBeenCalledWith('deal-1', {
      stage_id: 'stage-contactado',
      pipeline_id: 'pipe-1',
    });
  });

  it('sets a pending move immediately (optimistic UI) before the API resolves', async () => {
    // The API is intentionally slow — we check the store before it resolves
    let resolveApi!: (v: any) => void;
    updateMock.mockReturnValue(new Promise((res) => { resolveApi = res; }));

    const { Wrapper } = createWrapper();
    const kanbanData = makeKanbanData('stage-prospección');

    render(
      <Wrapper>
        <DealsKanban kanbanData={kanbanData} />
      </Wrapper>,
    );

    // Start the drag without awaiting
    act(() => {
      capturedOnDragEnd!({
        active: { id: 'deal-1' },
        over: { id: 'stage-contactado' },
      });
    });

    // pendingMoves should be set synchronously BEFORE the api resolves
    const { pendingMoves } = useKanbanStore.getState();
    expect(pendingMoves['deal-1']).toBe('stage-contactado');

    // Cleanup — resolve the promise so there are no dangling async ops
    await act(async () => {
      resolveApi({ data: {} });
    });
  });

  it('clears the pending move AFTER the server responds (deal stays in new column)', async () => {
    updateMock.mockResolvedValue({ data: { id: 'deal-1', stage_id: 'stage-contactado' } });

    const { Wrapper } = createWrapper();
    const kanbanData = makeKanbanData('stage-prospección');

    render(
      <Wrapper>
        <DealsKanban kanbanData={kanbanData} />
      </Wrapper>,
    );

    await act(async () => {
      capturedOnDragEnd!({
        active: { id: 'deal-1' },
        over: { id: 'stage-contactado' },
      });
    });

    // After full resolution, the pending move must be gone
    const { pendingMoves } = useKanbanStore.getState();
    expect(pendingMoves['deal-1']).toBeUndefined();
  });

  it('reverts the pending move when the API call fails', async () => {
    updateMock.mockRejectedValue(new Error('Network error'));

    const { Wrapper } = createWrapper();
    const kanbanData = makeKanbanData('stage-prospección');

    render(
      <Wrapper>
        <DealsKanban kanbanData={kanbanData} />
      </Wrapper>,
    );

    await act(async () => {
      capturedOnDragEnd!({
        active: { id: 'deal-1' },
        over: { id: 'stage-contactado' },
      });
    });

    // On failure the pending override must also be cleared (so UI reverts to server state)
    const { pendingMoves } = useKanbanStore.getState();
    expect(pendingMoves['deal-1']).toBeUndefined();
  });

  it('does NOT call the API when dropping onto the same stage', async () => {
    updateMock.mockResolvedValue({});

    const { Wrapper } = createWrapper();
    const kanbanData = makeKanbanData('stage-prospección');

    render(
      <Wrapper>
        <DealsKanban kanbanData={kanbanData} />
      </Wrapper>,
    );

    await act(async () => {
      capturedOnDragEnd!({
        active: { id: 'deal-1' },
        over: { id: 'stage-prospección' }, // same stage — no-op
      });
    });

    expect(updateMock).not.toHaveBeenCalled();
  });

  it('does NOT call the API when dropped outside any column (over = null)', async () => {
    const { Wrapper } = createWrapper();
    const kanbanData = makeKanbanData('stage-prospección');

    render(
      <Wrapper>
        <DealsKanban kanbanData={kanbanData} />
      </Wrapper>,
    );

    await act(async () => {
      capturedOnDragEnd!({ active: { id: 'deal-1' }, over: null });
    });

    expect(updateMock).not.toHaveBeenCalled();
  });
});
