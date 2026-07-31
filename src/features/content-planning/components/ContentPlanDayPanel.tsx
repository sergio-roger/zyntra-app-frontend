import React from 'react';
import { X } from 'lucide-react';
import { ContentPost } from '@features/content-planning/interfaces/content-post.interface';
import { ContentPostCard } from '@features/content-planning/components/ContentPostCard';
import { CardWrapper } from '@shared/components/CardWrapper';
import { Button } from '@core/ui/Button';

interface ContentPlanDayPanelProps {
  date: string;
  posts: ContentPost[];
  onClose: () => void;
}

export const ContentPlanDayPanel: React.FC<ContentPlanDayPanelProps> = ({ date, posts, onClose }) => (
  <CardWrapper hoverable={false} className="p-4 gap-4">
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-base-content">{date}</h3>
      <Button variant="secondary" outline size="sm" icon={X} aria-label="Cerrar" onClick={onClose} />
    </div>
    <div className="space-y-3">
      {posts.length ? (
        posts.map((post) => <ContentPostCard key={post.id} post={post} />)
      ) : (
        <p className="text-sm text-base-content/50">No hay posts programados para este día.</p>
      )}
    </div>
  </CardWrapper>
);

export default ContentPlanDayPanel;
