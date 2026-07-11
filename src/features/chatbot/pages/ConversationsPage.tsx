import { Textarea } from '@core/ui/Textarea';
import { ContactPanel } from '@features/chatbot/components/ContactPanel';
import { useChannels } from '@features/chatbot/hooks/useChannels';
import { useConversations } from '@features/chatbot/hooks/useConversations';
import { useConversationDetail } from '@features/chatbot/hooks/useConversationDetail';
import { useConversationSocket } from '@features/chatbot/hooks/useConversationSocket';
import {
  useInboxSoundSetting,
  useSetInboxSoundSetting,
} from '@features/chatbot/hooks/useInboxSoundSetting';
import { useSendAgentMessage } from '@features/chatbot/hooks/useSendAgentMessage';
import {
  getStatusBadge,
  getStatusDot,
  VIEW_TABS,
  formatDate,
} from '@features/chatbot/constants/chatbot.constants';
import { Avatar } from '@shared/components/Avatar';
import {
  Filter,
  Loader2,
  PanelRightOpen,
  Search,
  Send,
  Volume2,
  VolumeX,
} from 'lucide-react';
import React, { useMemo, useState, useRef, useEffect } from 'react';

export const ConversationsPage: React.FC = () => {
  const [selectedChannelId, setSelectedChannelId] = useState<string | undefined>(
    undefined,
  );
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [viewFilter, setViewFilter] = useState<'all' | 'mine' | 'unread'>('all');
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messageDraft, setMessageDraft] = useState('');
  const [search, setSearch] = useState('');
  const [contactPanelOpen, setContactPanelOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasActiveFilters = !!selectedChannelId || !!statusFilter;

  const { data: channels } = useChannels();
  const { data: conversations = [], isLoading } = useConversations({
    channelId: selectedChannelId,
    status: statusFilter,
    assignedToMe: viewFilter === 'mine',
    unread: viewFilter === 'unread',
  });
  const { data: selectedConv, isLoading: loadingDetail } =
    useConversationDetail(selectedConversationId);
  const sendAgentMessage = useSendAgentMessage();
  const { data: inboxSound } = useInboxSoundSetting();
  const setInboxSound = useSetInboxSoundSetting();
  const soundEnabled = inboxSound?.enabled ?? true;

  const { isVisitorTyping, notifyTyping, stopTyping } = useConversationSocket(
    selectedConversationId,
    soundEnabled,
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [selectedConv?.messages?.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        setSelectedConversationId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredConversations = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return conversations;
    return conversations.filter((c) => c.contactName.toLowerCase().includes(term));
  }, [conversations, search]);

  const selectConversation = (id: string) => {
    setSelectedConversationId(id);
    setMessageDraft('');
    setContactPanelOpen(false);
  };

  const handleSend = () => {
    const content = messageDraft.trim();
    if (!content || !selectedConversationId || sendAgentMessage.isPending) return;
    stopTyping();
    sendAgentMessage.mutate(
      { conversationId: selectedConversationId, content },
      { onSuccess: () => setMessageDraft('') },
    );
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div
        className="grid gap-4 flex-1 min-h-0"
        style={{ gridTemplateColumns: '320px 1fr' }}
      >
        {/* Lista de conversaciones */}
        <div className="card bg-base-200 p-3 flex flex-col min-h-0">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square relative"
                title="Filtros"
                onClick={() => setFiltersOpen(true)}
              >
                <Filter size={16} />
                {hasActiveFilters && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square"
                title={
                  soundEnabled
                    ? 'Silenciar notificaciones'
                    : 'Activar sonido de notificaciones'
                }
                disabled={setInboxSound.isPending}
                onClick={() => setInboxSound.mutate(!soundEnabled)}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>

            <div className="inline-flex gap-1 rounded-lg bg-base-300 p-1">
              {VIEW_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setViewFilter(tab.key)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                    viewFilter === tab.key
                      ? 'bg-primary text-primary-content'
                      : 'text-base-content/60 hover:text-base-content'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mb-3">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
            />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-sm input-bordered w-full pl-8"
            />
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto space-y-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-primary" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <p className="text-sm text-base-content/60 text-center py-8">
                No hay conversaciones aún
              </p>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  className={`w-full text-left p-2.5 rounded-lg hover:bg-base-300 transition flex items-start gap-2.5 ${
                    selectedConversationId === conv.id
                      ? 'bg-primary/20 border border-primary'
                      : ''
                  }`}
                  onClick={() => selectConversation(conv.id)}
                >
                  <div className="relative shrink-0">
                    <Avatar name={conv.contactName} size={36} />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-base-200 ${getStatusDot(conv.status)}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`truncate text-sm ${conv.unread ? 'font-bold' : 'font-medium'}`}
                      >
                        {conv.contactName}
                      </span>
                      <span className="text-[10px] text-base-content/50 shrink-0">
                        {formatDate(conv.lastMessageAt || conv.startedAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`badge badge-xs ${getStatusBadge(conv.status)}`}>
                        {conv.status}
                      </span>
                      {conv.assignedTo && conv.assignedTo.id !== 'system' && (
                        <span className="text-[10px] text-base-content/50 truncate">
                          {conv.assignedTo.name}
                        </span>
                      )}
                      {conv.unread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Hilo de mensajes */}
        <div className="card bg-base-200 p-4 flex flex-col relative overflow-hidden min-h-0">
          {!selectedConversationId ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-base-content/60">
                Selecciona una conversación para ver los mensajes
              </p>
            </div>
          ) : loadingDetail || !selectedConv ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-base-300">
                <Avatar name={selectedConv.contactName} size={40} />
                <div className="flex-1 min-w-0">
                  <span className="font-medium block truncate">
                    {selectedConv.contactName}
                  </span>
                  <span className="text-xs text-base-content/50">
                    Inicio: {formatDate(selectedConv.startedAt)}
                  </span>
                </div>
                <span
                  className={`badge badge-sm ${getStatusBadge(selectedConv.status)}`}
                >
                  {selectedConv.status}
                </span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm btn-square"
                  title="Detalles del contacto"
                  onClick={() => setContactPanelOpen(true)}
                >
                  <PanelRightOpen size={18} />
                </button>
              </div>

              <div className="space-y-4 flex-1 min-h-0 overflow-y-auto">
                {selectedConv.messages.map((msg) => {
                  const isVisitor = msg.role === 'user';
                  const isAgent = msg.role === 'agent';
                  return (
                    <div
                      key={msg.id}
                      className={`chat ${isVisitor ? 'chat-start' : 'chat-end'}`}
                    >
                      <div
                        className={`chat-bubble ${
                          isAgent
                            ? 'chat-bubble-secondary'
                            : isVisitor
                              ? ''
                              : 'chat-bubble-primary'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <div className="chat-footer text-xs opacity-50">
                        {formatDate(msg.createdAt)}
                      </div>
                    </div>
                  );
                })}
                {isVisitorTyping && (
                  <div className="chat chat-start">
                    <div className="chat-bubble text-xs italic opacity-60">
                      Escribiendo...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex items-end gap-2 pt-4 mt-4 border-t border-base-300">
                <Textarea
                  containerClassName="flex-1"
                  rows={2}
                  placeholder="Escribe un mensaje como agente..."
                  value={messageDraft}
                  disabled={sendAgentMessage.isPending}
                  onChange={(e) => {
                    setMessageDraft(e.target.value);
                    notifyTyping();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={!messageDraft.trim() || sendAgentMessage.isPending}
                  onClick={handleSend}
                >
                  {sendAgentMessage.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de filtros (canal + estado) */}
      {filtersOpen && (
        <div
          className="modal modal-open"
          onClick={(e) => {
            if (e.target === e.currentTarget) setFiltersOpen(false);
          }}
        >
          <div className="modal-box max-w-sm">
            <h3 className="font-bold text-lg mb-4">Filtros</h3>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Canal</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={selectedChannelId ?? ''}
                  onChange={(e) => setSelectedChannelId(e.target.value || undefined)}
                >
                  <option value="">Todos los canales</option>
                  {(channels ?? []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Estado</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={statusFilter ?? ''}
                  onChange={(e) => setStatusFilter(e.target.value || undefined)}
                >
                  <option value="">Todos los estados</option>
                  <option value="open">Abierta</option>
                  <option value="bot">Bot</option>
                  <option value="human">Humano</option>
                  <option value="closed">Cerrada</option>
                </select>
              </div>
            </div>
            <div className="modal-action">
              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setSelectedChannelId(undefined);
                    setStatusFilter(undefined);
                  }}
                >
                  Limpiar
                </button>
              )}
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setFiltersOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Panel de contacto deslizable */}
      {selectedConv && (
        <>
          <div
            className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
              contactPanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setContactPanelOpen(false)}
          />
          <div
            className={`fixed inset-y-0 right-0 w-80 z-50 p-4 transform transition-transform duration-300 ${
              contactPanelOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <ContactPanel
              conversationId={selectedConv.id}
              contactId={selectedConv.contactId}
              fallbackName={selectedConv.contactName}
              channel={selectedConv.channel}
              startedAt={selectedConv.startedAt}
              visitor={selectedConv.visitor}
              assignedTo={selectedConv.assignedTo}
              onClose={() => setContactPanelOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ConversationsPage;
