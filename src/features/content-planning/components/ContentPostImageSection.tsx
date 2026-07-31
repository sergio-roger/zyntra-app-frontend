import React from 'react';
import { ImagePlus, Check } from 'lucide-react';
import { ContentPost } from '@features/content-planning/interfaces/content-post.interface';
import { ContentPostStatus } from '@features/content-planning/enums/content-post-status.enum';
import { useApprovePost } from '@features/content-planning/hooks/use-approve-post';
import { Button } from '@core/ui/Button';

interface ContentPostImageSectionProps {
  post: ContentPost;
  onGenerate: () => void;
}

export const ContentPostImageSection: React.FC<ContentPostImageSectionProps> = ({ post, onGenerate }) => {
  const approvePost = useApprovePost();

  if (!post.imageUrl) {
    return (
      <Button variant="secondary" outline size="sm" icon={ImagePlus} onClick={onGenerate}>
        Generar imagen
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <img src={post.imageUrl} alt="" className="rounded-xl w-full object-cover" />
      {post.status === ContentPostStatus.WITH_IMAGE && (
        <Button variant="primary" size="sm" icon={Check} onClick={() => approvePost.mutate(post.id)}>
          Aprobar
        </Button>
      )}
    </div>
  );
};

export default ContentPostImageSection;
