import React from 'react';
import { ContentPost } from '@features/content-planning/interfaces/content-post.interface';
import { useGenerateImage } from '@features/content-planning/hooks/use-generate-image';
import { ContentPostVideoPlaceholder } from '@features/content-planning/components/ContentPostVideoPlaceholder';
import { ContentPostImageSection } from '@features/content-planning/components/ContentPostImageSection';

interface ContentPostCardProps {
  post: ContentPost;
}

export const ContentPostCard: React.FC<ContentPostCardProps> = ({ post }) => {
  const generateImage = useGenerateImage();
  const isVideo = post.mediaType === 'video';

  return (
    <div className="rounded-lg border p-4 space-y-2">
      <p className="text-xs uppercase text-base-content/60">{post.platform}</p>
      <p className="text-sm">{post.copyText}</p>

      {isVideo ? (
        <ContentPostVideoPlaceholder />
      ) : (
        <ContentPostImageSection
          post={post}
          onGenerate={() => generateImage.mutate({ postId: post.id, prompt: post.copyText })}
        />
      )}
    </div>
  );
};

export default ContentPostCard;
