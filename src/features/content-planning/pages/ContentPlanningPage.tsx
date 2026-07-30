import React, { useState } from 'react';
import { PageHeader } from '@shared/components/PageHeader';
import { CreatePlanWizard } from '@features/content-planning/components/CreatePlanWizard';
import { ContentPlan } from '@features/content-planning/interfaces/content-plan.interface';

export const ContentPlanningPage: React.FC = () => {
  const [plans, setPlans] = useState<ContentPlan[]>([]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Planificación de contenido"
        subtitle="Generá y organizá planes de contenido para tus redes sociales"
      />

      <CreatePlanWizard onCreated={(plan) => setPlans((prev) => [...prev, plan])} />

      {plans.length === 0 && (
        <p className="text-sm text-base-content/60">Todavía no creaste ningún plan.</p>
      )}
    </div>
  );
};

export default ContentPlanningPage;
