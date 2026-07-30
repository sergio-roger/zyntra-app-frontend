import React from 'react';
import { Link } from 'react-router-dom';
import { ContentPlan } from '@features/content-planning/interfaces/content-plan.interface';

interface ContentPlanListItemProps {
  plan: ContentPlan;
}

export const ContentPlanListItem: React.FC<ContentPlanListItemProps> = ({ plan }) => (
  <Link to={`/agents/projects/${plan.id}`} className="block rounded-lg border p-4 hover:bg-base-200">
    <p className="font-semibold">{plan.name}</p>
    <p className="text-sm text-base-content/60">{plan.startDate} — {plan.endDate}</p>
  </Link>
);

export default ContentPlanListItem;
