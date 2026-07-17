import React, { useState } from 'react';
import { Bot, FileText, Loader2, Send, User } from 'lucide-react';
import { useTestAgent } from '../../hooks/use-agents';
import { Agent, AgentTestResult } from '../../types/automations';

interface TestAgentTabProps {
  agent: Agent;
}

interface Exchange {
  message: string;
  result: AgentTestResult;
}

export const TestAgentTab: React.FC<TestAgentTabProps> = ({ agent }) => {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<Exchange[]>([]);
  const testAgent = useTestAgent(agent.id);

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || testAgent.isPending) return;
    setMessage('');
    const result = await testAgent.mutateAsync(trimmed);
    setHistory((prev) => [...prev, { message: trimmed, result }]);
  };

  return (
    <div className="max-w-2xl flex flex-col h-full min-h-[420px]">
      <p className="text-xs text-slate-500 mb-4">
        Probá al agente en un sandbox — no se guarda como conversación real.
      </p>

      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {history.length === 0 && (
          <p className="text-sm text-slate-500 py-8 text-center">
            Escribí un mensaje para empezar a probar el agente.
          </p>
        )}
        {history.map((exchange, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-start gap-2.5 justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary/15 px-3.5 py-2 text-sm text-slate-100">
                {exchange.message}
              </div>
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                <User size={13} />
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <Bot size={13} />
              </span>
              <div className="max-w-[80%] space-y-2">
                <div className="rounded-2xl rounded-tl-sm bg-slate-900/70 px-3.5 py-2 text-sm text-slate-200 whitespace-pre-wrap">
                  {exchange.result.reply}
                </div>
                {exchange.result.sources && exchange.result.sources.length > 0 && (
                  <div className="space-y-1">
                    {exchange.result.sources.map((source, si) => (
                      <div
                        key={si}
                        className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-900/40 rounded-lg px-2 py-1 mr-1"
                      >
                        <FileText size={10} />
                        {source.fileName}
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-[10px] text-slate-600">
                  {exchange.result.model}
                  {exchange.result.tokens !== undefined && ` · ${exchange.result.tokens} tokens`}
                </p>
              </div>
            </div>
          </div>
        ))}
        {testAgent.isPending && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Loader2 size={13} className="animate-spin" /> El agente está pensando...
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-4 mt-4 border-t border-white/5">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Escribí un mensaje de prueba..."
          className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim() || testAgent.isPending}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white disabled:opacity-50 transition-all"
          aria-label="Enviar mensaje"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
