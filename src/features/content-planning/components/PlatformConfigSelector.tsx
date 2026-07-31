import React from 'react';
import { ContentPlanPlatform } from '@features/content-planning/enums/content-plan-platform.enum';
import { ContentPlanPlatformConfig } from '@features/content-planning/interfaces/content-plan.interface';
import { PLATFORM_ICONS, PLATFORM_LABELS } from '@features/content-planning/constants/platform-icons.constant';

interface PlatformConfigSelectorProps {
  configs: ContentPlanPlatformConfig[];
  onChange: (configs: ContentPlanPlatformConfig[]) => void;
}

const ALL_PLATFORMS = Object.values(ContentPlanPlatform);
const DEFAULT_POSTS_PER_WEEK = 1;

export const PlatformConfigSelector: React.FC<PlatformConfigSelectorProps> = ({ configs, onChange }) => {
  const toggle = (platform: ContentPlanPlatform, isChecked: boolean) => {
    if (isChecked) {
      onChange([...configs, { platform, postsPerWeek: DEFAULT_POSTS_PER_WEEK }]);
      return;
    }
    onChange(configs.filter((c) => c.platform !== platform));
  };

  const updatePostsPerWeek = (platform: ContentPlanPlatform, postsPerWeek: number) => {
    onChange(configs.map((c) => (c.platform === platform ? { ...c, postsPerWeek } : c)));
  };

  return (
    <div className="space-y-2">
      {ALL_PLATFORMS.map((platform) => {
        const config = configs.find((c) => c.platform === platform);
        const PlatformIcon = PLATFORM_ICONS[platform];
        return (
          <div
            key={platform}
            className={`flex items-center gap-3 rounded-xl border p-3 transition-colors duration-200 ${
              config ? 'border-primary/40 bg-primary/5' : 'border-base-300 bg-base-200/40'
            }`}
          >
            <label className="flex flex-1 items-center gap-2 cursor-pointer">
              <input
                aria-label={platform}
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={!!config}
                onChange={(e) => toggle(platform, e.target.checked)}
              />
              <PlatformIcon size={16} className={config ? 'text-primary' : 'text-base-content/50'} />
              <span className="text-sm font-medium">{PLATFORM_LABELS[platform]}</span>
            </label>
            {config && (
              <label className="flex items-center gap-2">
                <span className="text-xs text-base-content/50">posts/semana</span>
                <input
                  aria-label={`posts por semana · ${platform}`}
                  type="number"
                  min={1}
                  className="input input-bordered input-sm w-16 rounded-lg text-center"
                  value={config.postsPerWeek}
                  onChange={(e) => updatePostsPerWeek(platform, Number(e.target.value))}
                />
              </label>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PlatformConfigSelector;
