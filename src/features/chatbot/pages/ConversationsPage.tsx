import { aiApi, Conversation, ConversationDetail } from '@features/chatbot/api/aiApi';
import { Clock, Loader2, RefreshCw, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ConversationsPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConv, setSelectedConv] = useState<ConversationDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const loadConversations = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await aiApi.getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadConversations();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadConversations]);

  const selectConversation = async (id: string) => {
    setLoadingDetail(true);
    try {
      const data = await aiApi.getConversationDetail(id);
      setSelectedConv(data);
    } catch (err) {
      console.error('Error loading conversation:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      open: 'badge-success',
      closed: 'badge-ghost',
      bot: 'badge-warning',
      human: 'badge-info',
    };
    return badges[status] || 'badge-ghost';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Conversaciones</h1>
          <p className="text-base-content/60">
            Chats atendidos por tu chatbot
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={loadConversations}>
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="card bg-base-200 p-4">
          <h2 className="font-semibold mb-4">Recientes</h2>
          
          {conversations.length === 0 ? (
            <p className="text-sm text-base-content/60">
              No hay conversaciones aún
            </p>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  className={`w-full text-left p-3 rounded-lg hover:bg-base-300 transition ${
                    selectedConv?.id === conv.id ? 'bg-primary/20 border border-primary' : ''
                  }`}
                  onClick={() => selectConversation(conv.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium flex items-center gap-2">
                      <User size={14} />
                      {conv.contact_name}
                    </span>
                    <span className={`badge badge-sm ${getStatusBadge(conv.status)}`}>
                      {conv.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-base-content/60 mt-1">
                    <Clock size={12} />
                    {formatDate(conv.last_message_at || conv.started_at)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card bg-base-200 p-4 lg:col-span-2">
          <h2 className="font-semibold mb-4">Detalle</h2>
          
          {!selectedConv ? (
            <p className="text-sm text-base-content/60">
              Selecciona una conversación para ver los mensajes
            </p>
          ) : loadingDetail ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-base-300">
                <div>
                  <span className="font-medium">{selectedConv.contact_name}</span>
                  <span className={`badge badge-sm ml-2 ${getStatusBadge(selectedConv.status)}`}>
                    {selectedConv.status}
                  </span>
                </div>
                <span className="text-sm text-base-content/60">
                  Inicio: {formatDate(selectedConv.started_at)}
                </span>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedConv.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`chat ${
                      msg.role === 'user' ? 'chat-end' : 'chat-start'
                    }`}
                  >
                    <div className="chat-bubble chat-bubble-primary">
                      {msg.content}
                    </div>
                    <div className="chat-footer text-xs opacity-50">
                      {formatDate(msg.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationsPage;