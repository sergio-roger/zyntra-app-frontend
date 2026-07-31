import React from 'react';
import { MoreHorizontal, Pause, Play, CheckCircle2, Trash2 } from 'lucide-react';
import { MarketingProjectStatus } from '@features/marketing-projects/enums/marketing-project-status.enum';
import { useUpdateMarketingProject } from '@features/marketing-projects/hooks/use-update-marketing-project';
import { useDeleteMarketingProject } from '@features/marketing-projects/hooks/use-delete-marketing-project';

interface ProjectCardMenuProps {
  projectId: string;
  status: MarketingProjectStatus;
}

export const ProjectCardMenu: React.FC<ProjectCardMenuProps> = ({ projectId, status }) => {
  const updateProject = useUpdateMarketingProject(projectId);
  const deleteProject = useDeleteMarketingProject();

  return (
    <div className="dropdown dropdown-end" onClick={(e) => e.preventDefault()}>
      <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle cursor-pointer">
        <MoreHorizontal size={16} />
      </label>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-200 rounded-xl w-44 border border-base-300">
        {status !== MarketingProjectStatus.PAUSED && (
          <li>
            <a onClick={() => updateProject.mutate({ status: MarketingProjectStatus.PAUSED })}>
              <Pause size={14} /> Pausar
            </a>
          </li>
        )}
        {status !== MarketingProjectStatus.ACTIVE && (
          <li>
            <a onClick={() => updateProject.mutate({ status: MarketingProjectStatus.ACTIVE })}>
              <Play size={14} /> Activar
            </a>
          </li>
        )}
        {status !== MarketingProjectStatus.COMPLETED && (
          <li>
            <a onClick={() => updateProject.mutate({ status: MarketingProjectStatus.COMPLETED })}>
              <CheckCircle2 size={14} /> Completar
            </a>
          </li>
        )}
        <li>
          <a className="text-error" onClick={() => deleteProject.mutate(projectId)}>
            <Trash2 size={14} /> Eliminar
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ProjectCardMenu;
