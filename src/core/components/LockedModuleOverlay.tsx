import { Lock, Zap } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PLAN_NAMES: Record<string, string> = {
  crm_leads: 'Impulse Pro',
  crm_deals: 'Impulse Pro',
  crm_fields: 'Impulse Pro',
  crm_segments: 'Impulse Pro',
  agents_ia: 'Impulse Pro',
  agents_strategy: 'Impulse Pro',
  agents_content: 'Impulse Pro',
  agents_analysis: 'Impulse Pro',
  inbox: 'Impulse Pro',
  inbox_conversations: 'Impulse Pro',
  inbox_automations: 'Impulse Pro',
  inbox_channels: 'Impulse Pro',
  funnels: 'Core Digital',
  funnels_builder: 'Core Digital',
  funnels_templates: 'Core Digital',
  funnels_automations: 'Core Digital',
  funnels_leads: 'Impulse Pro',
  funnels_analytics: 'Impulse Pro',
  avatar: 'Impulse Pro',
  avatar_identity: 'Impulse Pro',
  avatar_knowledge: 'Impulse Pro',
  avatar_voice: 'Core Digital',
  avatar_memory: 'Core Digital',
  analytics: 'Impulse Pro',
  settings_users: 'Impulse Pro',
  settings_teams: 'Impulse Pro',
  settings_channels: 'Impulse Pro',
};

interface LockedModuleOverlayProps {
  menuKey: string;
}

export const LockedModuleOverlay: React.FC<LockedModuleOverlayProps> = ({ menuKey }) => {
  const navigate = useNavigate();
  const suggestedPlan = PLAN_NAMES[menuKey] ?? 'Impulse Pro';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-warning/20 blur-3xl rounded-full" />
        <div className="relative bg-base-200 p-7 rounded-3xl border border-base-content/10 shadow-xl">
          <Lock className="h-16 w-16 text-warning mx-auto" />
        </div>
      </div>

      <h2 className="text-2xl font-black text-base-content mb-2 tracking-tight">
        Módulo bloqueado
      </h2>
      <p className="text-base-content/60 max-w-sm mx-auto mb-8 leading-relaxed">
        Este módulo no está incluido en tu plan actual. Actualiza a{' '}
        <span className="font-semibold text-primary">{suggestedPlan}</span> para
        desbloquearlo.
      </p>

      <button
        onClick={() => navigate('/billing')}
        className="btn btn-warning gap-2 shadow-lg shadow-warning/20"
      >
        <Zap size={16} />
        Ver planes y precios
      </button>
    </div>
  );
};
