import React, { useState } from 'react';
import { Loader2, Save, Search, BookOpen, UserPlus, CalendarClock } from 'lucide-react';
import { useUpdateAgent } from '../../hooks/use-agents';
import { Agent, AgentTool } from '../../types/automations';

const TOOL_DEFINITIONS: {
  tool: AgentTool;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  {
    tool: AgentTool.KNOWLEDGE_BASE,
    label: 'Base de conocimiento',
    description: 'Responde en base a los documentos subidos en la pestaña Conocimiento.',
    icon: BookOpen,
  },
  {
    tool: AgentTool.WEB_SEARCH,
    label: 'Búsqueda web',
    description: 'Permite al agente buscar información actualizada en internet.',
    icon: Search,
  },
  {
    tool: AgentTool.LEAD_CAPTURE,
    label: 'Captura de leads',
    description: 'El agente pide datos de contacto y los guarda como lead.',
    icon: UserPlus,
  },
  {
    tool: AgentTool.CALENDAR,
    label: 'Calendario',
    description: 'Permite al agente coordinar citas y horarios.',
    icon: CalendarClock,
  },
];

interface ToolsTabProps {
  agent: Agent;
}

export const ToolsTab: React.FC<ToolsTabProps> = ({ agent }) => {
  const updateAgent = useUpdateAgent(agent.id);
  const [tools, setTools] = useState<AgentTool[]>(agent.tools ?? []);

  const toggleTool = (tool: AgentTool) => {
    setTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool],
    );
  };

  const hasChanges =
    tools.length !== (agent.tools ?? []).length ||
    tools.some((t) => !(agent.tools ?? []).includes(t));

  const handleSave = () => updateAgent.mutateAsync({ tools });

  return (
    <div className="w-full space-y-4">
      {TOOL_DEFINITIONS.map(({ tool, label, description, icon: Icon }) => {
        const enabled = tools.includes(tool);
        return (
          <label
            key={tool}
            className="flex items-start gap-4 rounded-2xl border border-white/5 bg-slate-900/50 p-4 cursor-pointer hover:bg-slate-900/80 transition-colors"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Icon size={16} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-semibold text-slate-100">{label}</span>
              <span className="block text-xs text-slate-500 mt-0.5">{description}</span>
            </span>
            <input
              type="checkbox"
              className="toggle toggle-primary mt-1"
              checked={enabled}
              onChange={() => toggleTool(tool)}
            />
          </label>
        );
      })}

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || updateAgent.isPending}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
        >
          {updateAgent.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Guardar cambios
        </button>
      </div>
    </div>
  );
};
