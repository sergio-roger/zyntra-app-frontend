import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { DealsKanban } from '@crm/components/DealsKanban';
import { useKanbanStore } from '@crm/store/kanbanStore';
import { dealsKeys } from '@crm/hooks/useDeals';
import * as dealsApiModule from '@crm/api/deals.api';
import { KanbanResponse } from '@crm/types/kanban-response';
import { Deal } from '@crm/types/deal';
import { DealPipelineStage } from '@crm/types/deal-pipeline-stage';
import { DealPipeline } from '@crm/types/deal-pipeline';

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

const makeStage = (
  overrides: Partial<DealPipelineStage> = {},
): DealPipelineStage => ({
  id: 'stage-prospección',
  name: 'Prospección',
  color: '#4f46e5',
  position: 0,
  type: 'active',
  probabilityPercent: 10,
  pipelineId: 'pipe-1',
  ...overrides,
});

const makeDeal = (overrides: Partial<Deal> = {}): Deal => ({
  id: 'deal-1',
  businessId: 'biz-1',
  title: 'Test Deal',
  description: null,
  value: 1000,
  currency: 'COP',
  status: 'open',
  pipelineId: 'pipe-1',
  stageId: 'stage-prospección',
  assignedToId: null,
  teamId: null,
  expectedCloseDate: null,
  probability: 10,
  closedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const stageA = makeStage({
  id: 'stage-prospección',
  name: 'Prospección',
  position: 0,
});
const stageB = makeStage({
  id: 'stage-contactado',
  name: 'Contactado',
  position: 1,
});

const makePipeline = (): DealPipeline => ({
  id: 'pipe-1',
  name: 'Pipeline Principal',
  isDefault: true,
  position: 0,
  stages: [stageA, stageB],
  businessId: 'biz-1',
  teamId: null,
  deletedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const makeKanbanData = (dealStageId = 'stage-prospección'): KanbanResponse => ({
  pipeline: makePipeline(),
  columns: [
    {
      stage: stageA,
      deals:
        dealStageId === 'stage-prospección'
          ? [makeDeal({ stageId: 'stage-prospección' })]
          : [],
      total_value: dealStageId === 'stage-prospección' ? 1000 : 0,
    },
    {
      stage: stageB,
      deals:
        dealStageId === 'stage-contactado'
          ? [makeDeal({ stageId: 'stage-contactado' })]
          : [],
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
    updateMock.mockResolvedValue({
      data: { id: 'deal-1', stageId: 'stage-contactado' },
    });

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
      stageId: 'stage-contactado',
      pipelineId: 'pipe-1',
    });
  });

  it('updates the React Query cache optimistically before the API resolves', async () => {
    // The API is intentionally slow — we check the cache before it resolves
    let resolveApi!: (v: any) => void;
    updateMock.mockReturnValue(
      new Promise((res) => {
        resolveApi = res;
      }),
    );

    const { qc, Wrapper } = createWrapper();
    const kanbanData = makeKanbanData('stage-prospección');
    // Seed the cache so setQueryData has a base to patch
    qc.setQueryData(dealsKeys.kanban('pipe-1'), kanbanData);

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

    // Cache should reflect the move synchronously BEFORE the API resolves
    const cached = qc.getQueryData<typeof kanbanData>(
      dealsKeys.kanban('pipe-1'),
    );
    const destDeals =
      cached?.columns.find((c) => c.stage.id === 'stage-contactado')?.deals ??
      [];
    expect(destDeals.some((d) => d.id === 'deal-1')).toBe(true);

    // Cleanup — resolve the promise so there are no dangling async ops
    await act(async () => {
      resolveApi({ data: makeDeal({ stageId: 'stage-contactado' }) });
    });
  });

  it('deal stays in new column after the server responds', async () => {
    const updatedDeal = makeDeal({ stageId: 'stage-contactado' });
    updateMock.mockResolvedValue({ data: updatedDeal });

    const { qc, Wrapper } = createWrapper();
    const kanbanData = makeKanbanData('stage-prospección');
    qc.setQueryData(dealsKeys.kanban('pipe-1'), kanbanData);

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

    // After full resolution the deal must be in the destination column
    const cached = qc.getQueryData<typeof kanbanData>(
      dealsKeys.kanban('pipe-1'),
    );
    const destDeals =
      cached?.columns.find((c) => c.stage.id === 'stage-contactado')?.deals ??
      [];
    const srcDeals =
      cached?.columns.find((c) => c.stage.id === 'stage-prospección')?.deals ??
      [];
    expect(destDeals.some((d) => d.id === 'deal-1')).toBe(true);
    expect(srcDeals.some((d) => d.id === 'deal-1')).toBe(false);
  });

  it('reverts to server state when the API call fails', async () => {
    updateMock.mockRejectedValue(new Error('Network error'));

    const { qc, Wrapper } = createWrapper();
    const kanbanData = makeKanbanData('stage-prospección');
    qc.setQueryData(dealsKeys.kanban('pipe-1'), kanbanData);

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

    // On failure the query is invalidated (marked stale) so the next mount
    // will refetch the real server state
    expect(qc.getQueryState(dealsKeys.kanban('pipe-1'))?.isInvalidated).toBe(
      true,
    );
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
