import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WebChannelStepForm } from './WebChannelStepForm';
import { useChannelsStore } from '@features/channels/store/useChannelsStore';
import { Channel } from '@features/channels/types/channels.types';

const mockCreateMutateAsync = vi.fn();
const mockUpdateMutateAsync = vi.fn();

vi.mock('@features/channels/hooks/channels.queries', () => ({
  useCreateChannelMutation: () => ({
    mutateAsync: mockCreateMutateAsync,
    isPending: false,
  }),
  useUpdateChannelMutation: () => ({
    mutateAsync: mockUpdateMutateAsync,
    isPending: false,
  }),
}));

let mockAgents: { id: string; name: string; isActive: boolean }[] = [];
vi.mock('@features/ai-agents/hooks/useAiAgents', () => ({
  useAiAgents: () => ({ data: mockAgents }),
}));

const mockAssignAgent = vi.fn().mockResolvedValue({});
const mockUnassignAgent = vi.fn().mockResolvedValue({});
vi.mock('@features/channels/api/channels.api', () => ({
  channelsApi: {
    assignAgent: (...args: unknown[]) => mockAssignAgent(...args),
    unassignAgent: (...args: unknown[]) => mockUnassignAgent(...args),
  },
}));

const mockToastAdd = vi.fn();
vi.mock('@shared/components/toast/toastManager', () => ({
  toastManager: { add: (...args: unknown[]) => mockToastAdd(...args) },
}));

const baseChannelType = {
  id: 'type-1',
  key: 'web_chat',
  label: 'Web Chat',
  description: null,
  iconUrl: null,
  isAvailable: true,
  sortOrder: 0,
  configSchema: {},
};

type FormProps = React.ComponentProps<typeof WebChannelStepForm>;

const renderForm = (props: Partial<FormProps> = {}) => {
  const onCancel = vi.fn();
  const onCreated = vi.fn();
  const onUpdated = vi.fn();
  render(
    <MemoryRouter>
      <WebChannelStepForm
        mode="create"
        typeId="type-1"
        onCancel={onCancel}
        onCreated={onCreated}
        onUpdated={onUpdated}
        {...props}
      />
    </MemoryRouter>,
  );
  return { onCancel, onCreated, onUpdated };
};

const clickNext = () =>
  fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

const chooseOption = (containerTestId: string, optionLabel: string) => {
  const container = screen.getByTestId(containerTestId);
  fireEvent.click(within(container).getByRole('button'));
  fireEvent.click(screen.getByRole('option', { name: optionLabel }));
};

describe('WebChannelStepForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAgents = [];
    useChannelsStore.getState().resetForm();
  });

  it('does not advance from the identity step when name is empty', async () => {
    renderForm();
    clickNext();

    expect(
      await screen.findByText('El nombre del canal es requerido.'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('field-name')).toBeInTheDocument();
  });

  it('advances through every step with valid data and submits on create', async () => {
    const fakeChannel: Channel = {
      id: 'chan-1',
      businessId: 'biz-1',
      channelTypeId: 'type-1',
      channelType: baseChannelType,
      config: {},
      createdAt: '',
      updatedAt: '',
      name: 'Chat Principal',
      status: 'active',
      agentId: null,
    };
    mockCreateMutateAsync.mockResolvedValue(fakeChannel);

    const { onCreated } = renderForm();

    fireEvent.change(screen.getByTestId('field-name'), {
      target: { value: 'Chat Principal' },
    });
    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('availability-manual-panel')).toBeInTheDocument(),
    );

    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('field-domain-input')).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByTestId('field-domain-input'), {
      target: { value: 'not a domain' },
    });
    fireEvent.click(screen.getByTestId('add-domain'));
    expect(await screen.findByTestId('domain-error')).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('field-domain-input'), {
      target: { value: 'example.com' },
    });
    fireEvent.click(screen.getByTestId('add-domain'));
    expect(
      await screen.findByTestId('domain-chip-example.com'),
    ).toBeInTheDocument();

    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('agent-placeholder')).toBeInTheDocument(),
    );

    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('submit-web-channel-form')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('submit-web-channel-form'));

    await waitFor(() =>
      expect(mockCreateMutateAsync).toHaveBeenCalledTimes(1),
    );
    expect(mockCreateMutateAsync).toHaveBeenCalledWith({
      channelTypeId: 'type-1',
      name: 'Chat Principal',
      config: expect.objectContaining({
        allowedDomains: ['example.com'],
        primaryColor: '#6366f1',
        position: 'bottom-right',
        theme: 'auto',
      }),
    });
    await waitFor(() => expect(onCreated).toHaveBeenCalledWith(fakeChannel));
  });

  it('submits the manually selected availability status', async () => {
    const fakeChannel: Channel = {
      id: 'chan-availability',
      businessId: 'biz-1',
      channelTypeId: 'type-1',
      channelType: baseChannelType,
      config: {},
      createdAt: '',
      updatedAt: '',
      name: 'Chat Principal',
      status: 'active',
      agentId: null,
    };
    mockCreateMutateAsync.mockResolvedValue(fakeChannel);

    renderForm();

    fireEvent.change(screen.getByTestId('field-name'), {
      target: { value: 'Chat Principal' },
    });
    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('availability-manual-panel')).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByTestId('manual-status-busy'));
    expect(screen.getByTestId('widget-preview-status')).toHaveTextContent('Ocupado');

    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('field-domain-input')).toBeInTheDocument(),
    );
    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('agent-placeholder')).toBeInTheDocument(),
    );
    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('submit-web-channel-form')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('submit-web-channel-form'));

    await waitFor(() =>
      expect(mockCreateMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.objectContaining({
            availabilityMode: 'manual',
            manualStatus: 'busy',
          }),
        }),
      ),
    );
  });

  it('assigns the selected agent after creating the channel', async () => {
    mockAgents = [{ id: 'agent-1', name: 'Bot Ventas', isActive: true }];
    const fakeChannel: Channel = {
      id: 'chan-3',
      businessId: 'biz-1',
      channelTypeId: 'type-1',
      channelType: baseChannelType,
      config: {},
      createdAt: '',
      updatedAt: '',
      name: 'Chat Principal',
      status: 'active',
      agentId: null,
    };
    mockCreateMutateAsync.mockResolvedValue(fakeChannel);

    renderForm();

    fireEvent.change(screen.getByTestId('field-name'), {
      target: { value: 'Chat Principal' },
    });
    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('availability-manual-panel')).toBeInTheDocument(),
    );

    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('field-domain-input')).toBeInTheDocument(),
    );
    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('field-agent')).toBeInTheDocument(),
    );

    chooseOption('field-agent', 'Bot Ventas');

    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('submit-web-channel-form')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('submit-web-channel-form'));

    await waitFor(() =>
      expect(mockAssignAgent).toHaveBeenCalledWith('', 'chan-3', 'agent-1'),
    );
  });

  it('warns via toast but still finishes when agent assignment fails', async () => {
    mockAgents = [{ id: 'agent-1', name: 'Bot Ventas', isActive: true }];
    const fakeChannel: Channel = {
      id: 'chan-4',
      businessId: 'biz-1',
      channelTypeId: 'type-1',
      channelType: baseChannelType,
      config: {},
      createdAt: '',
      updatedAt: '',
      name: 'Chat Principal',
      status: 'active',
      agentId: null,
    };
    mockCreateMutateAsync.mockResolvedValue(fakeChannel);
    mockAssignAgent.mockRejectedValueOnce(new Error('boom'));

    const { onCreated } = renderForm();

    fireEvent.change(screen.getByTestId('field-name'), {
      target: { value: 'Chat Principal' },
    });
    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('availability-manual-panel')).toBeInTheDocument(),
    );

    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('field-domain-input')).toBeInTheDocument(),
    );
    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('field-agent')).toBeInTheDocument(),
    );
    chooseOption('field-agent', 'Bot Ventas');
    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('submit-web-channel-form')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('submit-web-channel-form'));

    await waitFor(() => expect(mockToastAdd).toHaveBeenCalled());
    await waitFor(() => expect(onCreated).toHaveBeenCalledWith(fakeChannel));
  });

  it('prefills values in edit mode and submits an update', async () => {
    const channel: Channel = {
      id: 'chan-2',
      businessId: 'biz-1',
      channelTypeId: 'type-1',
      channelType: baseChannelType,
      config: {
        greeting: 'Hola',
        assistantName: 'Bot',
        primaryColor: '#123456',
        position: 'bottom-left',
        theme: 'dark',
        allowedDomains: ['acme.com'],
      },
      createdAt: '',
      updatedAt: '',
      name: 'Canal existente',
      status: 'active',
      agentId: null,
    };
    mockUpdateMutateAsync.mockResolvedValue(channel);

    const { onUpdated } = renderForm({ mode: 'edit', channel });

    expect(screen.getByTestId('field-name')).toHaveValue('Canal existente');

    await waitFor(() =>
      expect(screen.getByTestId('field-primary-color')).toHaveValue('#123456'),
    );

    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('availability-manual-panel')).toBeInTheDocument(),
    );

    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('domain-chip-acme.com')).toBeInTheDocument(),
    );

    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('agent-placeholder')).toBeInTheDocument(),
    );

    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('submit-web-channel-form')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('submit-web-channel-form'));

    await waitFor(() =>
      expect(mockUpdateMutateAsync).toHaveBeenCalledTimes(1),
    );
    expect(mockUpdateMutateAsync).toHaveBeenCalledWith({
      name: 'Canal existente',
      config: expect.objectContaining({
        greeting: 'Hola',
        assistantName: 'Bot',
      }),
    });
    expect(mockToastAdd).toHaveBeenCalled();
    await waitFor(() => expect(onUpdated).toHaveBeenCalled());
  });

  it('shows a discard confirmation when cancelling with unsaved changes', async () => {
    const { onCancel } = renderForm();
    fireEvent.change(screen.getByTestId('field-name'), {
      target: { value: 'Algo' },
    });

    fireEvent.click(screen.getByTestId('cancel-web-channel-form'));
    expect(await screen.findByText('Descartar cambios')).toBeInTheDocument();
    expect(onCancel).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Descartar' }));
    await waitFor(() => expect(onCancel).toHaveBeenCalled());
  });

  it('shows the API error message and keeps the form when creation fails', async () => {
    mockCreateMutateAsync.mockRejectedValue({
      response: { data: { message: 'El nombre ya está en uso.' } },
    });

    const { onCreated } = renderForm();

    fireEvent.change(screen.getByTestId('field-name'), {
      target: { value: 'Chat Principal' },
    });
    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('availability-manual-panel')).toBeInTheDocument(),
    );

    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('field-domain-input')).toBeInTheDocument(),
    );
    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('agent-placeholder')).toBeInTheDocument(),
    );
    clickNext();
    await waitFor(() =>
      expect(screen.getByTestId('submit-web-channel-form')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('submit-web-channel-form'));

    expect(await screen.findByText('El nombre ya está en uso.')).toBeInTheDocument();
    expect(onCreated).not.toHaveBeenCalled();
  });

  it('cancels immediately without confirmation when there are no unsaved changes', () => {
    const { onCancel } = renderForm();
    fireEvent.click(screen.getByTestId('cancel-web-channel-form'));
    expect(onCancel).toHaveBeenCalled();
    expect(screen.queryByText('Descartar cambios')).not.toBeInTheDocument();
  });
});
