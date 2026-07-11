import { Textarea } from '@core/ui/Textarea';
import { Tabs, TabItem } from '@core/ui/Tabs';
import { ContactPanel } from '@features/chatbot/components/ContactPanel';
import { useChannels } from '@features/chatbot/hooks/useChannels';
import { useConversations } from '@features/chatbot/hooks/useConversations';
import { useConversationDetail } from '@features/chatbot/hooks/useConversationDetail';
import { useConversationSocket } from '@features/chatbot/hooks/useConversationSocket';
import { useSendAgentMessage } from '@features/chatbot/hooks/useSendAgentMessage';
import { Avatar } from '@shared/components/Avatar';
import {
  Globe,
  Loader2,
  LucideIcon,
  MessageSquare,
  Search,
  Send,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

const CHANNEL_ICONS: Record<string, LucideIcon> = {
  web_chat: Globe,
};

const iconForChannelType = (key: string): LucideIcon =>
  CHANNEL_ICONS[key] ?? MessageSquare;

const ALL_TAB = 'all';

const STATUS_BADGES: Record<string, string> = {
  open: 'badge-success',
  closed: 'badge-ghost',
  bot: 'badge-warning',
  human: 'badge-info',
};

const STATUS_DOTS: Record<string, string> = {
  open: 'bg-success',
  closed: 'bg-base-content/30',
  bot: 'bg-warning',
  human: 'bg-info',
};

const getStatusBadge = (status: string) => STATUS_BADGES[status] || 'badge-ghost';
const getStatusDot = (status: string) => STATUS_DOTS[status] || 'bg-base-content/30';

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const ConversationsPage: React.FC = () => {
  const [selectedChannelId, setSelectedChannelId] = useState<string | undefined>(
    undefined,
  );
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messageDraft, setMessageDraft] = useState('');
  const [search, setSearch] = useState('');

  const { data: channels } = useChannels();
  const { data: conversations = [], isLoading } = useConversations({
    channelId: selectedChannelId,
    status: statusFilter,
  });
  const { data: selectedConv, isLoading: loadingDetail } =
    useConversationDetail(selectedConversationId);
  const sendAgentMessage = useSendAgentMessage();

  useConversationSocket(selectedConversationId);

  const channelTabs: TabItem[] = [
    { key: ALL_TAB, label: 'Todos', icon: MessageSquare },
    ...(channels ?? []).map((c) => ({
      key: c.id,
      label: c.name,
      icon: iconForChannelType(c.channelType.key),
    })),
  ];

  const filteredConversations = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return conversations;
    return conversations.filter((c) => c.contactName.toLowerCase().includes(term));
  }, [conversations, search]);

  const selectConversation = (id: string) => {
    setSelectedConversationId(id);
    setMessageDraft('');
  };

  const handleSend = () => {
    const content = messageDraft.trim();
    if (!content || !selectedConversationId || sendAgentMessage.isPending) return;
    sendAgentMessage.mutate(
      { conversationId: selectedConversationId, content },
      { onSuccess: () => setMessageDraft('') },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Conversaciones</h1>
        <p className="text-base-content/60">Historial de chats y conversaciones</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Tabs
          tabs={channelTabs}
          active={selectedChannelId ?? ALL_TAB}
          onChange={(key) =>
            setSelectedChannelId(key === ALL_TAB ? undefined : key)
          }
          className="flex-1"
        />
        <select
          className="select select-sm select-bordered"
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

      <div className="grid gap-4" style={{ gridTemplateColumns: '300px 1fr 300px' }}>
        {/* Lista de conversaciones */}
        <div className="card bg-base-200 p-3">
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

          <div className="max-h-[65vh] overflow-y-auto space-y-1">
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
                      <span className="font-medium truncate text-sm">
                        {conv.contactName}
                      </span>
                      <span className="text-[10px] text-base-content/50 shrink-0">
                        {formatDate(conv.lastMessageAt || conv.startedAt)}
                      </span>
                    </div>
                    <span
                      className={`badge badge-xs mt-1 ${getStatusBadge(conv.status)}`}
                    >
                      {conv.status}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Hilo de mensajes */}
        <div className="card bg-base-200 p-4 flex flex-col">
          {!selectedConversationId ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-base-content/60">
                Selecciona una conversación para ver los mensajes
              </p>
            </div>
          ) : loadingDetail || !selectedConv ? (
            <div className="flex items-center justify-center py-16">
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
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto">
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
              </div>

              <div className="flex items-end gap-2 pt-4 mt-4 border-t border-base-300">
                <Textarea
                  containerClassName="flex-1"
                  rows={2}
                  placeholder="Escribe un mensaje como agente..."
                  value={messageDraft}
                  disabled={sendAgentMessage.isPending}
                  onChange={(e) => setMessageDraft(e.target.value)}
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

        {/* Panel de contacto (CRM) */}
        {selectedConversationId && selectedConv ? (
          <ContactPanel
            contactId={selectedConv.contactId}
            fallbackName={selectedConv.contactName}
            channel={selectedConv.channel}
            startedAt={selectedConv.startedAt}
            visitor={selectedConv.visitor}
          />
        ) : (
          <div className="card bg-base-200 p-4 flex items-center justify-center">
            <p className="text-sm text-base-content/40 text-center">
              Selecciona una conversación para ver el contacto
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsPage;
