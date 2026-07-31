import React from 'react';
import { Link } from 'react-router-dom';
import { ImageIcon, Users } from 'lucide-react';
import { MarketingProject } from '@features/marketing-projects/interfaces/marketing-project.interface';
import { CardWrapper } from '@shared/components/CardWrapper';
import { Badge } from '@core/ui/Badge';
import { ProjectCardMenu } from '@features/marketing-projects/components/ProjectCardMenu';
import { PROJECT_STATUS_BADGE_CLASSES, PROJECT_STATUS_LABELS } from '@features/marketing-projects/constants/project-status-labels.constant';

interface ProjectCardProps {
  project: MarketingProject;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <Link to={`/agents/projects/${project.id}`}>
    <CardWrapper className="overflow-hidden p-0 cursor-pointer">
      <div className="h-32 bg-base-300 flex items-center justify-center relative">
        {project.coverImageUrl ? (
          <img src={project.coverImageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon size={28} className="text-base-content/20" />
        )}
        <div className="absolute top-2 right-2">
          <ProjectCardMenu projectId={project.id} status={project.status} />
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base-content leading-tight">{project.name}</h3>
          <Badge className={PROJECT_STATUS_BADGE_CLASSES[project.status]}>
            {PROJECT_STATUS_LABELS[project.status]}
          </Badge>
        </div>

        {project.description && (
          <p className="text-xs text-base-content/60 line-clamp-2">{project.description}</p>
        )}

        <div>
          <div className="flex items-center justify-between text-xs text-base-content/50 mb-1">
            <span>Progreso</span>
            <span>{project.progressPercent ?? 0}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-base-300 overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${project.progressPercent ?? 0}%` }} />
          </div>
        </div>

        {project.kpiName && (
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="text-base-content/50">{project.kpiName}</p>
              <p className="font-bold text-base-content">
                {project.kpiCurrentValue} / {project.kpiTargetValue}
              </p>
            </div>
            {project.roiPercent != null && (
              <div className="text-right">
                <p className="text-base-content/50">ROI</p>
                <p className="font-bold text-success">{project.roiPercent}%</p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-1.5 text-base-content/40 pt-1 border-t border-base-300">
          <Users size={13} />
          <span className="text-xs">Equipo</span>
        </div>
      </div>
    </CardWrapper>
  </Link>
);

export default ProjectCard;
