import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarRange } from 'lucide-react';
import { PageHeader } from '@shared/components/PageHeader';
import { CreatePlanWizard } from '@features/content-planning/components/CreatePlanWizard';
import { CreditsUsageBadge } from '@features/content-planning/components/CreditsUsageBadge';
import { ContentPlanListItem } from '@features/content-planning/components/ContentPlanListItem';
import { useContentPlans } from '@features/content-planning/hooks/use-content-plans';

export const ContentPlanningPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: plans } = useContentPlans();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Planificación de contenido"
        subtitle="Generá y organizá planes de contenido para tus redes sociales"
        badge={<CreditsUsageBadge />}
      />

      <CreatePlanWizard onCreated={(plan) => navigate(`/agents/projects/${plan.id}`)} />

      <div className="space-y-3">
        {plans?.length ? (
          plans.map((plan) => <ContentPlanListItem key={plan.id} plan={plan} />)
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-base-300 py-10 text-center">
            <CalendarRange size={28} className="text-base-content/30" />
            <p className="text-sm text-base-content/50">Todavía no creaste ningún plan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPlanningPage;
