import React from 'react';
import { ContentPost } from '@features/content-planning/interfaces/content-post.interface';
import { ContentPostStatus } from '@features/content-planning/enums/content-post-status.enum';
import { useApprovePost } from '@features/content-planning/hooks/use-approve-post';

interface ContentPostImageSectionProps {
  post: ContentPost;
  onGenerate: () => void;
}

export const ContentPostImageSection: React.FC<ContentPostImageSectionProps> = ({ post, onGenerate }) => {
  const approvePost = useApprovePost();

  if (!post.imageUrl) {
    return (
      <button type="button" className="btn btn-sm" onClick={onGenerate}>
        Generar imagen
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <img src={post.imageUrl} alt="" className="rounded-md" />
      {post.status === ContentPostStatus.WITH_IMAGE && (
        <button type="button" className="btn btn-sm btn-primary" onClick={() => approvePost.mutate(post.id)}>
          Aprobar
        </button>
      )}
    </div>
  );
};

export default ContentPostImageSection;
