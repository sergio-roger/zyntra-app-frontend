import React from 'react';
import { ImageIcon } from 'lucide-react';
import { MarketingProject } from '@features/marketing-projects/interfaces/marketing-project.interface';
import { Badge } from '@core/ui/Badge';
import { PROJECT_STATUS_BADGE_CLASSES, PROJECT_STATUS_LABELS } from '@features/marketing-projects/constants/project-status-labels.constant';

interface MarketingProjectHeaderProps {
  project: MarketingProject;
}

export const MarketingProjectHeader: React.FC<MarketingProjectHeaderProps> = ({ project }) => (
  <div className="rounded-xl overflow-hidden border border-base-300">
    <div className="h-40 bg-base-300 flex items-center justify-center">
      {project.coverImageUrl ? (
        <img src={project.coverImageUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <ImageIcon size={32} className="text-base-content/20" />
      )}
    </div>
    <div className="p-5 bg-base-200 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-base-content">{project.name}</h2>
        <Badge className={PROJECT_STATUS_BADGE_CLASSES[project.status]}>
          {PROJECT_STATUS_LABELS[project.status]}
        </Badge>
      </div>
      {project.description && <p className="text-sm text-base-content/60">{project.description}</p>}
      <div className="flex flex-wrap gap-6 text-sm">
        {project.kpiName && (
          <div>
            <p className="text-base-content/50 text-xs">{project.kpiName}</p>
            <p className="font-bold text-base-content">{project.kpiCurrentValue} / {project.kpiTargetValue}</p>
          </div>
        )}
        {project.roiPercent != null && (
          <div>
            <p className="text-base-content/50 text-xs">ROI</p>
            <p className="font-bold text-success">{project.roiPercent}%</p>
          </div>
        )}
        <div>
          <p className="text-base-content/50 text-xs">Progreso</p>
          <p className="font-bold text-base-content">{project.progressPercent ?? 0}%</p>
        </div>
      </div>
    </div>
  </div>
);

export default MarketingProjectHeader;
