import React from 'react';
import { ContentPost } from '@features/content-planning/interfaces/content-post.interface';
import { useGenerateImage } from '@features/content-planning/hooks/use-generate-image';
import { ContentPostVideoPlaceholder } from '@features/content-planning/components/ContentPostVideoPlaceholder';
import { ContentPostImageSection } from '@features/content-planning/components/ContentPostImageSection';
import { CardWrapper } from '@shared/components/CardWrapper';
import { Badge } from '@core/ui/Badge';
import { PLATFORM_ICONS, PLATFORM_LABELS } from '@features/content-planning/constants/platform-icons.constant';

interface ContentPostCardProps {
  post: ContentPost;
}

const STATUS_BADGE_CLASSES: Record<ContentPost['status'], string> = {
  draft: 'badge-ghost',
  withImage: 'badge-info',
  approved: 'badge-success',
};

const STATUS_LABELS: Record<ContentPost['status'], string> = {
  draft: 'Borrador',
  withImage: 'Con imagen',
  approved: 'Aprobado',
};

export const ContentPostCard: React.FC<ContentPostCardProps> = ({ post }) => {
  const generateImage = useGenerateImage();
  const isVideo = post.mediaType === 'video';
  const PlatformIcon = PLATFORM_ICONS[post.platform];

  return (
    <CardWrapper className="p-4 gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-base-content/60 uppercase tracking-wide">
          <PlatformIcon size={14} />
          {PLATFORM_LABELS[post.platform]}
        </span>
        <Badge className={STATUS_BADGE_CLASSES[post.status]}>{STATUS_LABELS[post.status]}</Badge>
      </div>

      <p className="text-sm text-base-content leading-relaxed">{post.copyText}</p>

      {isVideo ? (
        <ContentPostVideoPlaceholder />
      ) : (
        <ContentPostImageSection
          post={post}
          onGenerate={() => generateImage.mutate({ postId: post.id, prompt: post.copyText })}
        />
      )}
    </CardWrapper>
  );
};

export default ContentPostCard;
