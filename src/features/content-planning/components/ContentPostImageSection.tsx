import React from 'react';
import { ContentPost } from '@features/content-planning/interfaces/content-post.interface';

interface ContentPostImageSectionProps {
  post: ContentPost;
  onGenerate: () => void;
}

export const ContentPostImageSection: React.FC<ContentPostImageSectionProps> = ({ post, onGenerate }) => {
  if (post.imageUrl) {
    return <img src={post.imageUrl} alt="" className="rounded-md" />;
  }

  return (
    <button type="button" className="btn btn-sm" onClick={onGenerate}>
      Generar imagen
    </button>
  );
};

export default ContentPostImageSection;
