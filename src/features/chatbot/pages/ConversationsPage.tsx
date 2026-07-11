import { Textarea } from '@core/ui/Textarea';
import { Tabs, TabItem } from '@core/ui/Tabs';
import { useChannels } from '@features/chatbot/hooks/useChannels';
import { useConversations } from '@features/chatbot/hooks/useConversations';
import { useConversationDetail } from '@features/chatbot/hooks/useConversationDetail';
import { useConversationSocket } from '@features/chatbot/hooks/useConversationSocket';
import { useSendAgentMessage } from '@features/chatbot/hooks/useSendAgentMessage';
import {
  Clock,
  Globe,
  Loader2,
  LucideIcon,
  MessageSquare,
  Send,
  User,
} from 'lucide-react';
import React, { useState } from 'react';

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

const getStatusBadge = (status: string) => STATUS_BADGES[status] || 'badge-ghost';

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

      <div
        className="grid gap-6 lg:grid-cols-3"
        style={{ gridTemplateColumns: '1fr 2fr' }}
      >
        <div className="card bg-base-200 p-4">
          <h2 className="font-semibold mb-4">Recientes</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-sm text-base-content/60">
              No hay conversaciones aún
            </p>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  className={`w-full text-left p-3 rounded-lg hover:bg-base-300 transition ${
                    selectedConversationId === conv.id
                      ? 'bg-primary/20 border border-primary'
                      : ''
                  }`}
                  onClick={() => selectConversation(conv.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium flex items-center gap-2">
                      <User size={14} />
                      {conv.contactName}
                    </span>
                    <span
                      className={`badge badge-sm ${getStatusBadge(conv.status)}`}
                    >
                      {conv.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-base-content/60 mt-1">
                    <Clock size={12} />
                    {formatDate(conv.lastMessageAt || conv.startedAt)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card bg-base-200 p-4 lg:col-span-2 flex flex-col">
          <h2 className="font-semibold mb-4">Detalle</h2>

          {!selectedConversationId ? (
            <p className="text-sm text-base-content/60">
              Selecciona una conversación para ver los mensajes
            </p>
          ) : loadingDetail || !selectedConv ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-base-300">
                <div>
                  <span className="font-medium">{selectedConv.contactName}</span>
                  <span
                    className={`badge badge-sm ml-2 ${getStatusBadge(selectedConv.status)}`}
                  >
                    {selectedConv.status}
                  </span>
                </div>
                <span className="text-sm text-base-content/60">
                  Inicio: {formatDate(selectedConv.startedAt)}
                </span>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto flex-1">
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
                          isAgent ? 'chat-bubble-secondary' : isVisitor ? '' : 'chat-bubble-primary'
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
      </div>
    </div>
  );
};

export default ConversationsPage;
