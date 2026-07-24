import { Loader2, Plus, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import {
  useOrchestratorRun,
  useTriggerOrchestratorRun,
} from '../hooks/use-agents-catalog';
import { SystemAgentCatalogItem } from '../types/agents';

interface AgentRunModalProps {
  agent: SystemAgentCatalogItem;
  onClose: () => void;
}

const GoalForm: React.FC<{ onSubmit: (goal: string) => void; isPending: boolean }> = ({
  onSubmit,
  isPending,
}) => {
  const [goal, setGoal] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(goal);
      }}
      className="space-y-4"
    >
      <div className="form-control">
        <label className="label">
          <span className="label-text">¿Qué objetivo querés lograr?</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          placeholder="Ej: Lanzar una campaña de captación de leads B2B"
          required
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
      </div>
      <div className="modal-action">
        <button type="submit" disabled={isPending} className="btn btn-primary gap-2">
          {isPending ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
          Generar estrategia
        </button>
      </div>
    </form>
  );
};

const RunResult: React.FC<{
  run: ReturnType<typeof useOrchestratorRun>['data'];
}> = ({ run }) => {
  const strategyResult = run?.steps
    ?.find((s) => s.step === 'execute-plan')
    ?.output as { results?: { output: string }[] } | undefined;

  if (!run || run.status === 'pending' || run.status === 'running') {
    return (
      <div className="flex items-center gap-3 text-base-content/60 py-8 justify-center">
        <Loader2 className="animate-spin" size={20} />
        Generando estrategia...
      </div>
    );
  }

  if (run.status === 'failed') {
    return (
      <div className="alert alert-error">
        <XCircle size={18} />
        <span>{run.errorMessage ?? 'Ocurrió un error.'}</span>
      </div>
    );
  }

  return (
    <div className="prose max-w-none bg-base-200/50 p-6 rounded-xl border border-base-300 overflow-auto max-h-96">
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
        {strategyResult?.results?.[0]?.output ?? 'No se generó ningún resultado.'}
      </pre>
    </div>
  );
};

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
