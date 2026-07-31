import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarDays, LayoutGrid } from 'lucide-react';
import { PageHeader } from '@shared/components/PageHeader';
import { CardWrapper } from '@shared/components/CardWrapper';
import { Button } from '@core/ui/Button';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import { MarketingProjectHeader } from '@features/marketing-projects/components/MarketingProjectHeader';
import { useMarketingProjectDetail } from '@features/marketing-projects/hooks/use-marketing-project-detail';
import { useProjectContentPlan } from '@features/marketing-projects/hooks/use-project-content-plan';
import { MarketingProjectType } from '@features/marketing-projects/enums/marketing-project-type.enum';
import { CreatePlanWizard } from '@features/content-planning/components/CreatePlanWizard';
import { ContentPlanCalendarView } from '@features/content-planning/components/ContentPlanCalendarView';
import { ContentPlanKanbanView } from '@features/content-planning/components/ContentPlanKanbanView';
import { ContentPlanDayPanel } from '@features/content-planning/components/ContentPlanDayPanel';
import { ContentPlanDetail } from '@features/content-planning/interfaces/content-plan-detail.interface';

type ViewMode = 'calendar' | 'kanban';

export const MarketingProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project } = useMarketingProjectDetail(id);
  const { data: contentPlan, refetch: refetchContentPlan } = useProjectContentPlan(id);
  const [view, setView] = useState<ViewMode>('calendar');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  if (!project) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader title={project.name} subtitle="Detalle del proyecto" />
      <MarketingProjectHeader project={project} />

      {project.type === MarketingProjectType.CONTENT_PLAN && (
        <ContentPlanSection
          contentPlan={contentPlan ?? null}
          projectId={project.id}
          onPlanCreated={refetchContentPlan}
          view={view}
          setView={setView}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      )}
    </div>
  );
};

interface ContentPlanSectionProps {
  contentPlan: ContentPlanDetail | null;
  projectId: string;
  onPlanCreated: () => void;
  view: ViewMode;
  setView: (view: ViewMode) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
}

const ContentPlanSection: React.FC<ContentPlanSectionProps> = ({
  contentPlan,
  projectId,
  onPlanCreated,
  view,
  setView,
  selectedDate,
  setSelectedDate,
}) => {
  if (!contentPlan) {
    return <CreatePlanWizard projectId={projectId} onCreated={onPlanCreated} />;
  }

  const postsForSelectedDay = contentPlan.posts.filter((p) => p.scheduledAt.startsWith(selectedDate ?? ''));

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button variant="primary" outline={view !== 'calendar'} size="sm" icon={CalendarDays} onClick={() => setView('calendar')}>
          Calendario
        </Button>
        <Button variant="primary" outline={view !== 'kanban'} size="sm" icon={LayoutGrid} onClick={() => setView('kanban')}>
          Kanban
        </Button>
      </div>

      {view === 'calendar' ? (
        <CardWrapper hoverable={false} className="p-4">
          <ErrorBoundary>
            <ContentPlanCalendarView posts={contentPlan.posts} onDayClick={setSelectedDate} />
          </ErrorBoundary>
        </CardWrapper>
      ) : (
        <ContentPlanKanbanView posts={contentPlan.posts} />
      )}

      {selectedDate && (
        <ContentPlanDayPanel date={selectedDate} posts={postsForSelectedDay} onClose={() => setSelectedDate(null)} />
      )}
    </div>
  );
};

export default MarketingProjectDetailPage;
