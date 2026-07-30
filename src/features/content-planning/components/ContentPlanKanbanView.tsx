import React from 'react';
import { ContentPost } from '@features/content-planning/interfaces/content-post.interface';
import { ContentPostStatus } from '@features/content-planning/enums/content-post-status.enum';
import { ContentPostCard } from '@features/content-planning/components/ContentPostCard';

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
    {(Object.keys(COLUMN_LABELS) as ContentPostStatus[]).map((status) => (
      <div key={status} className="space-y-3">
        <h4 className="font-semibold">{COLUMN_LABELS[status]}</h4>
        {posts.filter((p) => p.status === status).map((post) => (
          <ContentPostCard key={post.id} post={post} />
        ))}
      </div>
    ))}
  </div>
);

export default ContentPlanKanbanView;
