import React, { useState } from 'react';
import {
  useOrchestratorRun,
  useTriggerOrchestratorRun,
} from '@features/marketing/hooks/use-agents-catalog';
import { SystemAgentCatalogItem } from '@features/marketing/types/agents';
import { GoalForm } from '@features/marketing/components/GoalForm';
import { RunResult } from '@features/marketing/components/RunResult';

interface AgentRunModalProps {
  agent: SystemAgentCatalogItem;
  onClose: () => void;
}

export const AgentRunModal: React.FC<AgentRunModalProps> = ({ agent, onClose }) => {
  const [runId, setRunId] = useState<string | null>(null);
  const triggerRun = useTriggerOrchestratorRun();
  const { data: run } = useOrchestratorRun(runId);

  const handleSubmit = async (goal: string) => {
    const result = await triggerRun.mutateAsync(goal);
    setRunId(result.id);
  };

  return (
    <div className="modal modal-open !mt-0">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-bold text-xl">{agent.name}</h3>
            <p className="text-sm opacity-60">{agent.description}</p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost text-xl">
            ✕
          </button>
        </div>

        {!runId && <GoalForm onSubmit={handleSubmit} isPending={triggerRun.isPending} />}
        {runId && <RunResult run={run} />}
      </div>
    </div>
  );
};
