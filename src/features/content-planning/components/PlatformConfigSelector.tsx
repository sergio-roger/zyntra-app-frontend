import React from 'react';
import { ContentPlanPlatform } from '@features/content-planning/enums/content-plan-platform.enum';
import { ContentPlanPlatformConfig } from '@features/content-planning/interfaces/content-plan.interface';

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
        return (
          <div key={platform} className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                aria-label={platform}
                type="checkbox"
                className="checkbox"
                checked={!!config}
                onChange={(e) => toggle(platform, e.target.checked)}
              />
              <span className="capitalize">{platform}</span>
            </label>
            {config && (
              <label className="flex items-center gap-2">
                <span className="label-text">posts/semana</span>
                <input
                  aria-label={`posts por semana · ${platform}`}
                  type="number"
                  min={1}
                  className="input input-bordered input-sm w-20"
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
