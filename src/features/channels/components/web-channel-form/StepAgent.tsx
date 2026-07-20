import { Badge } from '@core/ui/Badge';
import { AGENT_TOOL_LABELS } from '@features/ai-agents/constants/ai-agents.constants';
import { useAiAgents } from '@features/ai-agents/hooks/useAiAgents';
import { WebChannelFormValues } from '@features/channels/schemas/web-channel.schema';
import { Bot, Check, Cpu, Sparkles } from 'lucide-react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export const StepAgent: React.FC = () => {
  const { watch, setValue } = useFormContext<WebChannelFormValues>();
  const agentId = watch('agentId');
  const { data: agents = [] } = useAiAgents();
  const activeAgents = agents.filter((a) => a.isActive);

  const selectAgent = (value: string | null) =>
    setValue('agentId', value, { shouldDirty: true });

  return (
    <div className="w-full rounded-2xl border border-white/5 bg-slate-950/30 p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
          <Bot size={14} className="text-slate-500" /> Agente de IA
        </h2>
        <Badge>Opcional</Badge>
      </div>

      {activeAgents.length === 0 ? (
        <p
          className="text-sm text-slate-400 bg-slate-900/40 rounded-xl p-4"
          data-testid="agent-placeholder"
        >
          Disponible cuando actives agentes de IA. Puedes continuar sin
          asignar uno y hacerlo más adelante.
        </p>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
          data-testid="field-agent"
        >
          <button
            type="button"
            data-testid="agent-option-none"
            onClick={() => selectAgent(null)}
            className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all ${
              !agentId
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-white/10 bg-slate-900/40 hover:border-white/20'
            }`}
          >
            <span className="flex w-full items-center justify-between text-sm font-bold text-white">
              Sin agente asignado
              {!agentId && <Check size={16} className="text-indigo-400" />}
            </span>
            <span className="text-[11px] text-slate-400">
              El canal quedará disponible para asignarlo más adelante.
            </span>
          </button>

          {activeAgents.map((agent) => {
            const selected = agentId === agent.id;
            return (
              <button
                key={agent.id}
                type="button"
                data-testid={`agent-option-${agent.id}`}
                onClick={() => selectAgent(agent.id)}
                className={`flex flex-col items-start gap-2.5 rounded-xl border p-4 text-left transition-all ${
                  selected
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-white/10 bg-slate-900/40 hover:border-white/20'
                }`}
              >
                <span className="flex w-full items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm font-bold text-white">
                    <Sparkles size={14} className="text-slate-500 shrink-0" />
                    {agent.name}
                  </span>
                  {selected && <Check size={16} className="text-indigo-400 shrink-0" />}
                </span>

                <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Cpu size={12} className="shrink-0" />
                  {agent.model}
                </span>

                {agent.tools.length > 0 && (
                  <span className="flex flex-wrap gap-1.5">
                    {agent.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full border border-white/10 bg-slate-950/60 px-2 py-0.5 text-[10px] font-medium text-slate-400"
                      >
                        {AGENT_TOOL_LABELS[tool]}
                      </span>
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
