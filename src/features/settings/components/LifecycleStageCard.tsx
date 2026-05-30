import React from 'react';
import { GripVertical, MoreHorizontal, Trash2, Settings2, Lock } from 'lucide-react';
import { Badge } from '../../../core/ui/Badge';

interface LifecycleStage {
  id?: string;
  name: string;
  description: string;
  icon: string;
  type: 'active' | 'lost';
  is_default: boolean;
  is_won: boolean;
  is_system: boolean;
  position: number;
}

interface LifecycleStageCardProps {
  stage: LifecycleStage;
  index: number;
  labelPrefix?: string;
  onUpdateName: (newName: string) => void;
  onUpdateDescription: (newDesc: string) => void;
  onSetDefault: () => void;
  onDelete: () => void;
  accentColor?: 'primary' | 'amber';
}

export const LifecycleStageCard: React.FC<LifecycleStageCardProps> = ({
  stage,
  index,
  labelPrefix = 'Etapa',
  onUpdateName,
  onUpdateDescription,
  onSetDefault,
  onDelete,
  accentColor = 'primary',
}) => {
  const [showDescription, setShowDescription] = React.useState(false);
  const isAmber = accentColor === 'amber';
  const focusBorderClass = isAmber ? 'focus:border-amber-500/40' : 'focus:border-primary/40';
  const hoverColorClass = isAmber ? 'hover:text-amber-500' : 'hover:text-primary';

  return (
    <div className={`group relative bg-base-100 ${isAmber ? 'bg-base-100/50' : ''} rounded-xl p-4 border border-base-content/5 ${isAmber ? 'hover:border-amber-500/30' : 'hover:border-primary/30'} transition-all animate-in fade-in slide-in-from-top-2 duration-300`}>
      <div className="flex items-center gap-4">
        {!isAmber && (
          <div className="cursor-grab text-base-content/20 hover:text-base-content/40 transition-colors pt-2">
            <GripVertical size={18} />
          </div>
        )}
        
        <div className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-lg ${isAmber ? 'bg-base-200/50' : 'bg-base-200'} text-xl shadow-inner mt-1`}>
          {stage.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[9px] uppercase tracking-wider font-bold ${isAmber ? 'text-base-content/20' : 'text-base-content/30'}`}>
              {labelPrefix} {index + 1}
            </span>
            <div className="flex gap-1">
              {stage.is_default && (
                <Badge className="badge-primary">Etapa predeterminada</Badge>
              )}
              {stage.is_won && (
                <Badge className="badge-success">Etapa ganada</Badge>
              )}
            </div>
          </div>
          <input 
            value={stage.name}
            onChange={(e) => onUpdateName(e.target.value)}
            className={`bg-base-200/40 font-bold text-sm focus:outline-none w-full border border-base-content/10 ${focusBorderClass} rounded-lg px-3 py-1.5`}
            placeholder="Nombre de la etapa"
          />
          
          <button 
            onClick={() => setShowDescription(!showDescription)}
            className={`text-[10px] text-base-content/40 mt-1 flex items-center gap-1 cursor-pointer ${hoverColorClass} transition-colors`}
          >
            {showDescription ? 'Ocultar descripción' : 'Mostrar descripción'}
          </button>

          {showDescription && (
            <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <input
                type="text"
                value={stage.description}
                onChange={(e) => onUpdateDescription(e.target.value)}
                className={`w-full bg-base-200/30 border border-base-content/5 rounded-lg px-3 py-2 text-[11px] focus:outline-none ${focusBorderClass} transition-all`}
                placeholder="Agrega una descripción breve..."
              />
            </div>
          )}
        </div>

        <div className="dropdown dropdown-end dropdown-bottom mt-1">
          <label tabIndex={0} className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-primary transition-colors">
            <MoreHorizontal size={16} />
          </label>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-200 rounded-xl w-56 border border-base-content/5 animate-in fade-in zoom-in-95 duration-200">
            <li className={stage.is_default ? 'disabled' : ''}>
              <a 
                className={`text-xs font-medium flex items-center gap-2 py-2 ${stage.is_default ? 'pointer-events-none opacity-50' : ''}`}
                onClick={() => !stage.is_default && onSetDefault()}
              >
                <Settings2 size={14} />
                Establecer como predeterminado
              </a>
            </li>
            <div className="divider my-0 opacity-10"></div>
            <li className={stage.is_system ? 'disabled' : ''}>
              <a 
                className={`text-xs font-medium text-error flex items-center justify-between gap-2 py-2 ${stage.is_system ? 'pointer-events-none opacity-50' : 'hover:bg-error/10'}`}
                onClick={() => !stage.is_system && onDelete()}
              >
                <div className="flex items-center gap-2">
                  <Trash2 size={14} />
                  Eliminar
                </div>
                {stage.is_system && <Lock size={12} className="text-base-content/40" />}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
