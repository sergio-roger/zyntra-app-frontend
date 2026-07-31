import { Share2 } from 'lucide-react';
import { ContentPlanPlatform } from '@features/content-planning/enums/content-plan-platform.enum';
import { InstagramIcon } from '@features/content-planning/components/icons/InstagramIcon';
import { FacebookIcon } from '@features/content-planning/components/icons/FacebookIcon';

export const PLATFORM_ICONS: Record<ContentPlanPlatform, typeof Share2> = {
  [ContentPlanPlatform.INSTAGRAM]: InstagramIcon,
  [ContentPlanPlatform.FACEBOOK]: FacebookIcon,
  [ContentPlanPlatform.MANUAL]: Share2,
};

export const PLATFORM_LABELS: Record<ContentPlanPlatform, string> = {
  [ContentPlanPlatform.INSTAGRAM]: 'Instagram',
  [ContentPlanPlatform.FACEBOOK]: 'Facebook',
  [ContentPlanPlatform.MANUAL]: 'Manual',
};
