import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bot,
  BookOpen,
  Brain,
  Loader2,
  MessageCircle,
  Mic,
  UserRound,
  Wrench,
} from 'lucide-react';
import { Tabs, TabItem } from '@core/ui/Tabs';
import { ModuleGuard } from '@core/components/ModuleGuard';
import { useAgent } from '../hooks/use-agents';
import { IdentityTab } from '../components/tabs/IdentityTab';
import { ToolsTab } from '../components/tabs/ToolsTab';
import { KnowledgeTab } from '../components/tabs/KnowledgeTab';
import { TestAgentTab } from '../components/tabs/TestAgentTab';
import { ComingSoonTab } from '../components/tabs/ComingSoonTab';

type TabKey = 'identity' | 'tools' | 'knowledge' | 'voice' | 'memory' | 'test';

export const AgentDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { agentId } = useParams<{ agentId: string }>();
  const isCreate = !agentId || agentId === 'new';

  const { data: agent, isLoading } = useAgent(isCreate ? undefined : agentId);
  const [activeTab, setActiveTab] = useState<TabKey>('identity');

  const tabs: TabItem<TabKey>[] = [
    { key: 'identity', label: 'Identidad', icon: UserRound },
    { key: 'tools', label: 'Herramientas', icon: Wrench, disabled: isCreate },
    { key: 'knowledge', label: 'Conocimiento', icon: BookOpen, disabled: isCreate },
    { key: 'voice', label: 'Voz', icon: Mic, disabled: isCreate },
    { key: 'memory', label: 'Memoria', icon: Brain, disabled: isCreate },
    { key: 'test', label: 'Probar agente', icon: MessageCircle, disabled: isCreate },
  ];

  if (!isCreate && isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-slate-500" />
      </div>
    );
  }

  if (!isCreate && !agent) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-slate-400">No se encontró el agente.</p>
        <button
          onClick={() => navigate('/automations/agents')}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Volver a agentes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/automations/agents')}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/50 border border-white/5 text-slate-400 hover:text-white transition-colors"
          aria-label="Volver a agentes"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <Bot size={16} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {isCreate ? 'Nuevo agente' : agent?.name}
            </h2>
            {!isCreate && (
              <p className="text-xs text-slate-500">{agent?.model}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-56 shrink-0">
          <Tabs
            tabs={tabs}
            active={activeTab}
            onChange={setActiveTab}
            orientation="vertical"
          />
        </div>

        <div className="flex-1 min-w-0 rounded-2xl border border-white/5 bg-slate-900/30 p-6">
          {activeTab === 'identity' && (
            <ModuleGuard menuKey="automations_agents_identity">
              <IdentityTab
                agent={agent}
                onCreated={(created) => navigate(`/automations/agents/${created.id}`)}
              />
            </ModuleGuard>
          )}

          {activeTab === 'tools' && agent && (
            <ModuleGuard menuKey="automations_agents_tools">
              <ToolsTab agent={agent} />
            </ModuleGuard>
          )}

          {activeTab === 'knowledge' && agent && (
            <ModuleGuard menuKey="automations_agents_knowledge">
              <KnowledgeTab agent={agent} />
            </ModuleGuard>
          )}

          {activeTab === 'voice' && (
            <ModuleGuard menuKey="automations_agents_voice">
              <ComingSoonTab
                icon={Mic}
                title="Voz"
                description="La configuración de voz para agentes va a estar disponible próximamente."
              />
            </ModuleGuard>
          )}

          {activeTab === 'memory' && (
            <ModuleGuard menuKey="automations_agents_memory">
              <ComingSoonTab
                icon={Brain}
                title="Memoria"
                description="La configuración de memoria y contexto para agentes va a estar disponible próximamente."
              />
            </ModuleGuard>
          )}

          {activeTab === 'test' && agent && (
            // Sin key específica en el árbol de menús para esta tab: hereda el
            // acceso del módulo padre (mismo fallback que ya usa el backend
            // en PlanModuleGuard/menu.service para keys sin fila propia).
            <ModuleGuard menuKey="automations_agents">
              <TestAgentTab agent={agent} />
            </ModuleGuard>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPage;
