import React from 'react';
import { Zap } from 'lucide-react';
import { useCreditsUsage } from '@features/content-planning/hooks/use-credits-usage';
import { Badge } from '@core/ui/Badge';

const USAGE_WARNING_THRESHOLD = 0.9;

export const CreditsUsageBadge: React.FC = () => {
  const { data } = useCreditsUsage();

  if (!data) return null;

  const isNearLimit = data.limit > 0 && data.used / data.limit >= USAGE_WARNING_THRESHOLD;

  return (
    <Badge className={isNearLimit ? 'badge-warning' : 'badge-primary'}>
      <Zap size={10} />
      {data.used}/{data.limit} créditos
    </Badge>
  );
};

export default CreditsUsageBadge;
