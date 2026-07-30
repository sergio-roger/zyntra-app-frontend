import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@shared/components/PageHeader';
import { useContentPlanDetail } from '@features/content-planning/hooks/use-content-plan-detail';
import { ContentPlanCalendarView } from '@features/content-planning/components/ContentPlanCalendarView';
import { ContentPlanKanbanView } from '@features/content-planning/components/ContentPlanKanbanView';
import { ContentPlanDayPanel } from '@features/content-planning/components/ContentPlanDayPanel';

type ViewMode = 'calendar' | 'kanban';

export const ContentPlanDetailPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const { data } = useContentPlanDetail(planId);
  const [view, setView] = useState<ViewMode>('calendar');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  if (!data) return null;

  const postsForSelectedDay = data.posts.filter((p) => p.scheduledAt.startsWith(selectedDate ?? ''));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader title={data.plan.name} subtitle={`${data.plan.startDate} — ${data.plan.endDate}`} />

      <div className="flex gap-2">
        <button type="button" className="btn btn-sm" onClick={() => setView('calendar')}>
          Calendario
        </button>
        <button type="button" className="btn btn-sm" onClick={() => setView('kanban')}>
          Kanban
        </button>
      </div>

      {view === 'calendar' ? (
        <ContentPlanCalendarView posts={data.posts} onDayClick={setSelectedDate} />
      ) : (
        <ContentPlanKanbanView posts={data.posts} />
      )}

      {selectedDate && (
        <ContentPlanDayPanel date={selectedDate} posts={postsForSelectedDay} onClose={() => setSelectedDate(null)} />
      )}
    </div>
  );
};

export default ContentPlanDetailPage;
