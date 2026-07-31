import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarDays, LayoutGrid } from 'lucide-react';
import { PageHeader } from '@shared/components/PageHeader';
import { useContentPlanDetail } from '@features/content-planning/hooks/use-content-plan-detail';
import { ContentPlanCalendarView } from '@features/content-planning/components/ContentPlanCalendarView';
import { ContentPlanKanbanView } from '@features/content-planning/components/ContentPlanKanbanView';
import { ContentPlanDayPanel } from '@features/content-planning/components/ContentPlanDayPanel';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import { Button } from '@core/ui/Button';
import { CardWrapper } from '@shared/components/CardWrapper';

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
        <Button
          variant="primary"
          outline={view !== 'calendar'}
          size="sm"
          icon={CalendarDays}
          onClick={() => setView('calendar')}
        >
          Calendario
        </Button>
        <Button
          variant="primary"
          outline={view !== 'kanban'}
          size="sm"
          icon={LayoutGrid}
          onClick={() => setView('kanban')}
        >
          Kanban
        </Button>
      </div>

      {view === 'calendar' ? (
        <CardWrapper hoverable={false} className="p-4">
          <ErrorBoundary>
            <ContentPlanCalendarView posts={data.posts} onDayClick={setSelectedDate} />
          </ErrorBoundary>
        </CardWrapper>
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
