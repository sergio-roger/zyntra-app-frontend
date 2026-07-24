import { Loader2, XCircle } from 'lucide-react';
import React from 'react';
import { useOrchestratorRun } from '@features/marketing/hooks/use-agents-catalog';

interface RunResultProps {
  run: ReturnType<typeof useOrchestratorRun>['data'];
}

export const RunResult: React.FC<RunResultProps> = ({ run }) => {
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
