import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Bot } from 'lucide-react';
import { WebChannelFormValues } from '@features/channels/schemas/web-channel.schema';
import { useAiAgents } from '@features/ai-agents/hooks/useAiAgents';

export const StepAgent: React.FC = () => {
  const { watch, setValue } = useFormContext<WebChannelFormValues>();
  const agentId = watch('agentId');
  const { data: agents = [] } = useAiAgents();
  const activeAgents = agents.filter((a) => a.is_active);

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body gap-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Bot size={18} /> Agente de IA
          <span className="badge badge-ghost badge-sm">Opcional</span>
        </h2>

        {activeAgents.length === 0 ? (
          <p
            className="text-sm text-base-content/60 bg-base-200 rounded-lg p-3"
            data-testid="agent-placeholder"
          >
            Disponible cuando actives agentes de IA. Puedes continuar sin
            asignar uno y hacerlo más adelante.
          </p>
        ) : (
          <div className="form-control gap-1">
            <label className="label">
              <span className="label-text font-medium">
                Asignar agente (opcional)
              </span>
            </label>
            <select
              className="select select-bordered"
              data-testid="field-agent"
              value={agentId ?? ''}
              onChange={(e) =>
                setValue('agentId', e.target.value || null, {
                  shouldDirty: true,
                })
              }
            >
              <option value="">Sin agente asignado</option>
              {activeAgents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
