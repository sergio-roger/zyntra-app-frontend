import React from 'react';
import { ContentPost } from '@features/content-planning/interfaces/content-post.interface';
import { ContentPostCard } from '@features/content-planning/components/ContentPostCard';

interface ContentPlanDayPanelProps {
  date: string;
  posts: ContentPost[];
  onClose: () => void;
}

export const ContentPlanDayPanel: React.FC<ContentPlanDayPanelProps> = ({ date, posts, onClose }) => (
  <div className="rounded-lg border p-4 space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold">{date}</h3>
      <button type="button" aria-label="Cerrar" className="btn btn-ghost btn-sm" onClick={onClose}>
        ✕
      </button>
    </div>
    <div className="space-y-3">
      {posts.map((post) => (
        <ContentPostCard key={post.id} post={post} />
      ))}
    </div>
  </div>
);

export default ContentPlanDayPanel;
