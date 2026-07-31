import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ChevronRight } from 'lucide-react';
import { ContentPlan } from '@features/content-planning/interfaces/content-plan.interface';
import { CardWrapper } from '@shared/components/CardWrapper';

interface ContentPlanListItemProps {
  plan: ContentPlan;
}

export const ContentPlanListItem: React.FC<ContentPlanListItemProps> = ({ plan }) => (
  <Link to={`/agents/projects/${plan.id}`} className="block">
    <CardWrapper className="p-4 cursor-pointer">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <CalendarDays size={18} />
          </div>
          <div>
            <p className="font-bold text-base-content">{plan.name}</p>
            <p className="text-xs text-base-content/50">{plan.startDate} — {plan.endDate}</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-base-content/30 shrink-0" />
      </div>
    </CardWrapper>
  </Link>
);

export default ContentPlanListItem;
