import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  Bot,
  ChevronRight,
  Send,
  FlaskConical,
} from 'lucide-react';
import {
  useAiAgents,
  useCreateAiAgent,
  useUpdateAiAgent,
  useDeleteAiAgent,
  useTestAiAgent,
} from '../hooks/useAiAgents';
import {
  AiAgent,
  AgentTool,
  CreateAgentPayload,
} from '../types/ai-agents.types';

const ALL_TOOLS: { key: AgentTool; label: string }[] = [
  { key: 'web_search', label: 'Búsqueda web' },
  { key: 'knowledge_base', label: 'Base de conocimiento' },
  { key: 'lead_capture', label: 'Captura de leads' },
  { key: 'calendar', label: 'Calendario' },
];

const MODELS = [
  'claude-haiku-4-5-20251001',
  'claude-sonnet-4-6',
  'claude-opus-4-8',
];

const EMPTY_FORM: CreateAgentPayload = {
  name: '',
  model: MODELS[0],
  system_prompt: '',
  temperature: 0.7,
  tools: [],
  is_active: true,
};

// ── Sandbox panel ──────────────────────────────────────────────────────────────
function SandboxPanel({ agent }: { agent: AiAgent }) {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<
    { role: 'user' | 'assistant'; text: string }[]
  >([]);
  const { mutateAsync: testAgent, isPending } = useTestAiAgent(agent.id);

  const handleSend = async () => {
    if (!message.trim() || isPending) return;
    const userMsg = message.trim();
    setMessage('');
    setHistory((h) => [...h, { role: 'user', text: userMsg }]);
    try {
      const result = await testAgent(userMsg);
      setHistory((h) => [...h, { role: 'assistant', text: result.reply }]);
    } catch {
      setHistory((h) => [
        ...h,
        { role: 'assistant', text: '⚠ Error al procesar la respuesta.' },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full border border-base-300 rounded-xl overflow-hidden bg-base-50">
      <div className="px-4 py-2 border-b border-base-300 bg-base-200 flex items-center gap-2">
        <FlaskConical size={14} className="text-primary" />
        <span className="text-sm font-medium">Sandbox — {agent.name}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {history.length === 0 && (
          <p className="text-xs text-center text-base-content/40 mt-8">
            Envía un mensaje para probar el agente.
          </p>
        )}
        {history.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                m.role === 'user'
                  ? 'bg-primary text-primary-content'
                  : 'bg-base-200 text-base-content'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isPending && (
          <div className="flex justify-start">
            <div className="bg-base-200 rounded-xl px-3 py-2">
              <Loader2 size={14} className="animate-spin text-primary" />
            </div>
          </div>
        )}
      </div>
      <div className="p-3 border-t border-base-300 flex gap-2">
        <input
          type="text"
          className="input input-bordered input-sm flex-1"
          placeholder="Escribe un mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isPending}
        />
        <button
          className="btn btn-primary btn-sm"
          onClick={handleSend}
          disabled={isPending || !message.trim()}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Agent form sidebar ─────────────────────────────────────────────────────────
function AgentFormSidebar({
  editing,
  onClose,
}: {
  editing: AiAgent | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CreateAgentPayload>(
    editing
      ? {
          name: editing.name,
          model: editing.model,
          system_prompt: editing.systemPrompt,
          temperature: editing.temperature,
          tools: editing.tools,
          is_active: editing.isActive,
        }
      : { ...EMPTY_FORM },
  );
  const [error, setError] = useState('');

  const { mutateAsync: createAgent, isPending: creating } = useCreateAiAgent();
  const { mutateAsync: updateAgent, isPending: updating } = useUpdateAiAgent(
    editing?.id ?? '',
  );
  const isPending = creating || updating;

  const toggleTool = (tool: AgentTool) => {
    setForm((f) => ({
      ...f,
      tools: f.tools?.includes(tool)
        ? f.tools.filter((t) => t !== tool)
        : [...(f.tools ?? []), tool],
    }));
  };

  const handleSave = async () => {
    setError('');
    if (!form.name?.trim()) {
      setError('El nombre es requerido.');
      return;
    }
    if (!form.system_prompt?.trim()) {
      setError('El prompt del sistema es requerido.');
      return;
    }
    try {
      if (editing) {
        await updateAgent(form);
      } else {
        await createAgent(form);
      }
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? 'Error al guardar el agente.');
    }
  };

  return (
    <div
      className="fixed inset-y-0 right-0 w-full max-w-md bg-base-100 shadow-2xl border-l border-base-300 flex flex-col z-50"
      data-testid="agent-form-sidebar"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
        <h2 className="font-semibold">
          {editing ? 'Editar agente' : 'Nuevo agente'}
        </h2>
        <button className="btn btn-ghost btn-sm btn-square" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {error && (
          <div className="alert alert-error text-sm">
            <AlertCircle size={16} /> <span>{error}</span>
          </div>
        )}

        <div className="form-control gap-1">
          <label className="label">
            <span className="label-text font-medium">Nombre *</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>

        <div className="form-control gap-1">
          <label className="label">
            <span className="label-text font-medium">Modelo</span>
          </label>
          <select
            className="select select-bordered"
            value={form.model}
            onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
          >
            {MODELS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control gap-1">
          <label className="label">
            <span className="label-text font-medium">Prompt del sistema *</span>
            <span className="label-text-alt text-base-content/50">
              {form.system_prompt?.length ?? 0}/8000
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered h-40 text-sm font-mono"
            placeholder="Eres un asistente de ventas experto en..."
            maxLength={8000}
            value={form.system_prompt}
            onChange={(e) =>
              setForm((f) => ({ ...f, system_prompt: e.target.value }))
            }
          />
        </div>

        <div className="form-control gap-1">
          <label className="label">
            <span className="label-text font-medium">Temperatura</span>
            <span className="label-text-alt">
              {form.temperature?.toFixed(1)}
            </span>
          </label>
          <input
            type="range"
            className="range range-primary range-sm"
            min="0"
            max="1"
            step="0.1"
            value={form.temperature}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                temperature: parseFloat(e.target.value),
              }))
            }
          />
          <div className="flex justify-between text-xs text-base-content/40 px-0.5">
            <span>Preciso</span>
            <span>Creativo</span>
          </div>
        </div>

        <div className="form-control gap-2">
          <label className="label">
            <span className="label-text font-medium">Herramientas</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ALL_TOOLS.map(({ key, label }) => (
              <label
                key={key}
                className="label cursor-pointer justify-start gap-2 bg-base-200 rounded-lg px-3 py-2"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                  checked={form.tools?.includes(key) ?? false}
                  onChange={() => toggleTool(key)}
                />
                <span className="label-text text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-control gap-1">
          <label className="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-sm"
              checked={form.is_active ?? true}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_active: e.target.checked }))
              }
            />
            <span className="label-text font-medium">Agente activo</span>
          </label>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-base-300 flex justify-end gap-2">
        <button className="btn btn-ghost" onClick={onClose}>
          Cancelar
        </button>
        <button
          className="btn btn-primary gap-1"
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {editing ? 'Guardar cambios' : 'Crear agente'}
        </button>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export const AiAgentsPage: React.FC = () => {
  const { data: agents = [], isLoading, isError } = useAiAgents();
  const { mutateAsync: deleteAgent, isPending: deleting } = useDeleteAiAgent();

  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AiAgent | null>(null);
  const [sandboxAgent, setSandboxAgent] = useState<AiAgent | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const openEdit = (agent: AiAgent) => {
    setEditingAgent(agent);
    setShowForm(true);
  };
  const openNew = () => {
    setEditingAgent(null);
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditingAgent(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAgent(id);
      setDeletingId(null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setDeleteError(msg ?? 'No se puede eliminar el agente.');
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Agentes de IA</h1>
          <p className="text-base-content/60 mt-1">
            Configura los asistentes que responden en tus canales.
          </p>
        </div>
        <button className="btn btn-primary gap-1" onClick={openNew}>
          <Plus size={16} /> Nuevo agente
        </button>
      </div>

      {deleteError && (
        <div className="alert alert-error mb-4 text-sm">
          <AlertCircle size={16} /> <span>{deleteError}</span>
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => setDeleteError('')}
          >
            <X size={12} />
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      )}

      {isError && (
        <div className="alert alert-error">
          <AlertCircle size={18} /> <span>Error al cargar los agentes.</span>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="flex gap-4 h-[calc(100vh-12rem)]">
          {/* Agent list */}
          <div
            className={`flex flex-col gap-3 ${sandboxAgent ? 'w-1/2' : 'w-full max-w-3xl'}`}
          >
            {agents.length === 0 && (
              <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body items-center text-center gap-3 py-12">
                  <Bot size={40} className="text-base-content/20" />
                  <p className="text-base-content/50">
                    Aún no tienes agentes. Crea uno para empezar.
                  </p>
                  <button className="btn btn-primary btn-sm" onClick={openNew}>
                    <Plus size={14} /> Crear primer agente
                  </button>
                </div>
              </div>
            )}

            {agents.map((agent) => (
              <div
                key={agent.id}
                className={`card bg-base-100 border shadow-sm transition-all ${
                  sandboxAgent?.id === agent.id
                    ? 'border-primary'
                    : 'border-base-300'
                }`}
              >
                <div className="card-body flex-row items-center gap-4 py-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Bot size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{agent.name}</p>
                      <span
                        className={`badge badge-xs ${agent.isActive ? 'badge-success' : 'badge-ghost'}`}
                      >
                        {agent.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <p className="text-xs text-base-content/50 truncate">
                      {agent.model}
                    </p>
                    <p className="text-xs text-base-content/40 mt-0.5 line-clamp-1">
                      {agent.systemPrompt.slice(0, 80)}…
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      className={`btn btn-ghost btn-sm gap-1 ${sandboxAgent?.id === agent.id ? 'text-primary' : ''}`}
                      onClick={() =>
                        setSandboxAgent(
                          sandboxAgent?.id === agent.id ? null : agent,
                        )
                      }
                      title="Probar en sandbox"
                    >
                      <FlaskConical size={14} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => openEdit(agent)}
                      title="Editar"
                    >
                      <Pencil size={14} />
                    </button>
                    {deletingId === agent.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setDeletingId(null)}
                        >
                          Cancelar
                        </button>
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => handleDelete(agent.id)}
                          disabled={deleting}
                        >
                          {deleting ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            'Confirmar'
                          )}
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() => setDeletingId(agent.id)}
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <ChevronRight size={14} className="text-base-content/30" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sandbox panel */}
          {sandboxAgent && (
            <div className="flex-1 min-w-0">
              <SandboxPanel agent={sandboxAgent} />
            </div>
          )}
        </div>
      )}

      {showForm && (
        <AgentFormSidebar editing={editingAgent} onClose={closeForm} />
      )}
    </div>
  );
};
