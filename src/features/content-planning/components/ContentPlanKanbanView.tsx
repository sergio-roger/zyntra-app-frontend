import React from 'react';
import { ContentPost } from '@features/content-planning/interfaces/content-post.interface';
import { ContentPostStatus } from '@features/content-planning/enums/content-post-status.enum';
import { ContentPostCard } from '@features/content-planning/components/ContentPostCard';
import { Badge } from '@core/ui/Badge';

interface ContentPlanKanbanViewProps {
  posts: ContentPost[];
}

const COLUMN_LABELS: Record<ContentPostStatus, string> = {
  [ContentPostStatus.DRAFT]: 'Borrador',
  [ContentPostStatus.WITH_IMAGE]: 'Con imagen',
  [ContentPostStatus.APPROVED]: 'Aprobado',
};

export const ContentPlanKanbanView: React.FC<ContentPlanKanbanViewProps> = ({ posts }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {(Object.keys(COLUMN_LABELS) as ContentPostStatus[]).map((status) => {
      const columnPosts = posts.filter((p) => p.status === status);
      return (
        <div key={status} className="rounded-xl bg-base-200/40 border border-base-300 p-3 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="font-bold text-sm text-base-content">{COLUMN_LABELS[status]}</h4>
            <Badge className="badge-ghost">{columnPosts.length}</Badge>
          </div>
          {columnPosts.map((post) => (
            <ContentPostCard key={post.id} post={post} />
          ))}
        </div>
      );
    })}
  </div>
);

export default ContentPlanKanbanView;
