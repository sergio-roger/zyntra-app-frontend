import React from 'react';
import { useCreditsUsage } from '@features/content-planning/hooks/use-credits-usage';

export const CreditsUsageBadge: React.FC = () => {
  const { data } = useCreditsUsage();

  if (!data) return null;

  return (
    <span className="badge badge-outline">
      {data.used}/{data.limit} créditos
    </span>
  );
};

export default CreditsUsageBadge;
