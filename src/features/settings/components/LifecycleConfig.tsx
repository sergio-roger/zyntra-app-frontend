import api from '@shared/api/axios';
import {
  Loader2,
  Plus,
  Save
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { LifecycleStageCard } from './LifecycleStageCard';
import { CardWrapper } from '@shared/components/CardWrapper';

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

export const LifecycleConfig: React.FC = () => {
  const [stages, setStages] = useState<LifecycleStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [addingTo, setAddingTo] = useState<'active' | 'lost' | null>(null);
  const [newStageName, setNewStageName] = useState('');
  const [newStageDesc, setNewStageDesc] = useState('');

  const fetchStages = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/lifecycle/stages');
      setStages(response.data);
    } catch (error) {
      console.error('Error fetching stages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStages();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchStages]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.post('/lifecycle/stages', stages);
      await fetchStages(); // Refresh with IDs
    } catch (error) {
      console.error('Error saving stages:', error);
    } finally {
      setSaving(false);
    }
  };

  const confirmAddStage = () => {
    if (!newStageName.trim()) return;
    
    const newStage: LifecycleStage = {
      name: newStageName,
      description: newStageDesc,
      icon: addingTo === 'active' ? '⚡' : '👋',
      type: addingTo!,
      is_default: false,
      is_won: false,
      is_system: false,
      position: stages.length
    };
    
    setStages([...stages, newStage]);
    cancelAdd();
  };

  const cancelAdd = () => {
    setAddingTo(null);
    setNewStageName('');
    setNewStageDesc('');
  };

  const handleDeleteStage = (stageToDelete: LifecycleStage) => {
    if (stageToDelete.is_system) return;
    setStages(stages.filter(s => s !== stageToDelete));
  };

  const updateStageProperty = <K extends keyof LifecycleStage>(
    stage: LifecycleStage,
    property: K,
    value: LifecycleStage[K]
  ) => {
    setStages((prevStages) =>
      prevStages.map((s) => (s === stage ? { ...s, [property]: value } : s))
    );
  };

  const activeStages = stages.filter(s => s.type === 'active');
  const lostStages = stages.filter(s => s.type === 'lost');

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight">Configurar etapas de ciclo de vida</h2>
          <p className="text-sm text-slate-400">Gestiona cómo evolucionan tus contactos en el sistema.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-sm px-6" onClick={() => fetchStages()} disabled={saving}>Cancelar</button>
          <button 
            className="btn btn-primary btn-sm px-6 shadow-lg shadow-primary/20" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Guardar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Stages Section */}
        <div className="space-y-4">
          <CardWrapper hoverable={false} className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl">🏆</span>
              <div>
                <h2 className="font-bold text-base-content/90">Etapas de ciclo de vida</h2>
                <p className="text-xs text-base-content/50">Rastrea contactos a través de etapas clave.</p>
              </div>
            </div>

            <div className="space-y-3">
              {activeStages.map((stage, index) => (
                <LifecycleStageCard 
                  key={stage.id || index}
                  stage={stage}
                  index={index}
                  onUpdateName={(val) => updateStageProperty(stage, 'name', val)}
                  onUpdateDescription={(val) => updateStageProperty(stage, 'description', val)}
                  onSetDefault={() => {
                    const newStages = stages.map(s => ({
                      ...s,
                      is_default: s === stage
                    }));
                    setStages(newStages);
                  }}
                  onDelete={() => handleDeleteStage(stage)}
                />
              ))}
              
              {addingTo === 'active' ? (
                <div className="bg-base-100 rounded-xl p-3 border border-primary/30 shadow-lg">
                  <h3 className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Nueva Etapa Activa</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[9px] font-bold text-base-content/40 ml-1">Nombre</label>
                      <input 
                        autoFocus
                        value={newStageName}
                        onChange={(e) => setNewStageName(e.target.value)}
                        className="w-full bg-base-200/50 border border-base-content/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary/50 transition-all mt-0.5"
                        placeholder="Ej: Análisis técnico"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-base-content/40 ml-1">Descripción</label>
                      <textarea 
                        value={newStageDesc}
                        onChange={(e) => setNewStageDesc(e.target.value)}
                        className="w-full bg-base-200/50 border border-base-content/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary/50 transition-all mt-0.5 min-h-[60px]"
                        placeholder="Descripción opcional..."
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={cancelAdd} className="btn btn-ghost btn-xs px-3">Cancelar</button>
                      <button onClick={confirmAddStage} className="btn btn-primary btn-sm btn-xs px-5 shadow-lg shadow-primary/20 text-[10px]">Añadir</button>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setAddingTo('active')}
                  className="w-full py-4 border-2 border-dashed border-base-content/10 rounded-xl text-xs font-bold text-base-content/40 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group"
                >
                  <Plus size={14} className="group-hover:scale-125 transition-transform" />
                  Añadir etapa
                </button>
              )}
            </div>
          </CardWrapper>
        </div>

        {/* Lost Stages Section */}
        <div className="space-y-4">
          <CardWrapper hoverable={false} className="p-6 border-amber-500/10 bg-amber-500/5">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl">😔</span>
              <div>
                <h2 className="font-bold text-amber-500/90">Etapas perdidas</h2>
                <p className="text-xs text-amber-500/50">Rastrea dónde van los contactos al salir del proceso.</p>
              </div>
            </div>

            <div className="space-y-3">
              {lostStages.map((stage, index) => (
                <LifecycleStageCard 
                  key={stage.id || index}
                  stage={stage}
                  index={index}
                  labelPrefix="Etapa perdida"
                  accentColor="amber"
                  onUpdateName={(val) => updateStageProperty(stage, 'name', val)}
                  onUpdateDescription={(val) => updateStageProperty(stage, 'description', val)}
                  onSetDefault={() => {
                    const newStages = stages.map(s => ({
                      ...s,
                      is_default: s === stage
                    }));
                    setStages(newStages);
                  }}
                  onDelete={() => handleDeleteStage(stage)}
                />
              ))}

              {addingTo === 'lost' ? (
                <div className="bg-base-100 rounded-xl p-3 border border-amber-500/30 shadow-lg">
                  <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-2">Nueva Etapa Perdida</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[9px] font-bold text-base-content/40 ml-1">Nombre</label>
                      <input 
                        autoFocus
                        value={newStageName}
                        onChange={(e) => setNewStageName(e.target.value)}
                        className="w-full bg-base-200/50 border border-base-content/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-amber-500/50 transition-all mt-0.5"
                        placeholder="Ej: No responde"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-base-content/40 ml-1">Descripción</label>
                      <textarea 
                        value={newStageDesc}
                        onChange={(e) => setNewStageDesc(e.target.value)}
                        className="w-full bg-base-200/50 border border-base-content/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-amber-500/50 transition-all mt-0.5 min-h-[60px]"
                        placeholder="Motivo de pérdida..."
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={cancelAdd} className="btn btn-ghost btn-xs px-3">Cancelar</button>
                      <button onClick={confirmAddStage} className="btn btn-warning btn-sm btn-xs px-5 shadow-lg shadow-warning/20 text-[10px]">Añadir</button>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setAddingTo('lost')}
                  className="w-full py-4 border-2 border-dashed border-base-content/10 rounded-xl text-xs font-bold text-base-content/40 hover:border-amber-500/30 hover:text-amber-500 hover:bg-amber-500/5 transition-all flex items-center justify-center gap-2 group"
                >
                  <Plus size={14} className="group-hover:scale-125 transition-transform" />
                  Añadir etapa
                </button>
              )}
            </div>
          </CardWrapper>
        </div>
      </div>
    </div>
  );
};
