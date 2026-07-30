import React from 'react';
import { useNavigate } from 'react-router-dom';
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
          <p className="text-sm text-base-content/60">Todavía no creaste ningún plan.</p>
        )}
      </div>
    </div>
  );
};

export default ContentPlanningPage;
