import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Bot } from 'lucide-react';
import { Select } from '@core/ui/Select';
import { Badge } from '@core/ui/Badge';
import { WebChannelFormValues } from '@features/channels/schemas/web-channel.schema';
import { useAiAgents } from '@features/ai-agents/hooks/useAiAgents';

export const StepAgent: React.FC = () => {
  const { watch, setValue } = useFormContext<WebChannelFormValues>();
  const agentId = watch('agentId');
  const { data: agents = [] } = useAiAgents();
  const activeAgents = agents.filter((a) => a.isActive);

  return (
    <div className="max-w-2xl rounded-2xl border border-white/5 bg-slate-950/30 p-6 space-y-4">
      <h2 className="flex items-center gap-2 text-sm font-bold text-white">
        <Bot size={16} className="text-slate-400" /> Agente de IA
        <Badge>Opcional</Badge>
      </h2>

      {activeAgents.length === 0 ? (
        <p
          className="text-sm text-slate-400 bg-slate-900/40 rounded-xl p-4"
          data-testid="agent-placeholder"
        >
          Disponible cuando actives agentes de IA. Puedes continuar sin
          asignar uno y hacerlo más adelante.
        </p>
      ) : (
        <div data-testid="field-agent">
          <Select
            label="Asignar agente (opcional)"
            icon={Bot}
            clearable
            clearLabel="Sin agente asignado"
            placeholder="Sin agente asignado"
            options={activeAgents.map((a) => ({ label: a.name, value: a.id }))}
            value={agentId}
            onChange={(value) =>
              setValue('agentId', value, { shouldDirty: true })
            }
          />
        </div>
      )}
    </div>
  );
};
