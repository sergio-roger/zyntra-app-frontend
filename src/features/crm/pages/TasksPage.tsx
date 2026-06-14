import React, { useState } from 'react';
import { 
  Plus, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Trash2,
  Clock,
  User
} from 'lucide-react';
import { useCrmTasks, useUpdateTask, useDeleteTask } from '@crm/hooks/useCrmTasks';
import { TaskFormSidebar } from '@crm/components/TaskFormSidebar';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import type { CrmTask, TaskStatus } from '@crm/types';

export const TasksPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('pending');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CrmTask | null>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<CrmTask | null>(null);

  const { data: tasks = [], isLoading, isError, error } = useCrmTasks({ 
    status: statusFilter || undefined 
  });
  
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();

  const handleToggleStatus = async (task: CrmTask) => {
    const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateMutation.mutateAsync({ id: task.id, status: newStatus });
  };

  const openCreate = () => {
    setEditingTask(null);
    setSidebarOpen(true);
  };

  const openEdit = (task: CrmTask) => {
    setEditingTask(task);
    setSidebarOpen(true);
  };

  const handleDeleteRequest = (task: CrmTask) => {
    setTaskToDelete(task);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await deleteMutation.mutateAsync(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const isOverdue = (date: string) => {
    return new Date(date) < new Date() && statusFilter !== 'completed';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Gestión de Tareas</h2>
          <p className="text-sm text-slate-400">Organiza tus seguimientos y actividades diarias</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-px hover:shadow-xl active:scale-95"
        >
          <Plus size={18} /> Nueva Tarea
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 p-1 bg-slate-950/50 rounded-2xl border border-white/5 w-fit">
        {(['pending', 'completed', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              statusFilter === status 
                ? 'bg-slate-800 text-white shadow-lg' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {status === 'pending' ? 'Pendientes' : status === 'completed' ? 'Completadas' : 'Canceladas'}
          </button>
        ))}
        <button
          onClick={() => setStatusFilter('')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            statusFilter === '' 
              ? 'bg-slate-800 text-white shadow-lg' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Todas
        </button>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-sm text-slate-500 font-medium">Cargando tus tareas...</p>
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-sm text-rose-300">
          <AlertCircle size={24} className="text-rose-500" />
          <p>{(error as Error).message}</p>
        </div>
      )}

      {!isLoading && tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-950/20 rounded-3xl border-2 border-dashed border-white/5 opacity-50">
          <CheckCircle2 size={48} className="text-slate-600 mb-4" />
          <p className="text-slate-400 font-medium text-center">
            {statusFilter === 'completed' ? 'Aún no has completado tareas.' : 'No tienes tareas pendientes. ¡Buen trabajo!'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className={`group bg-slate-900/50 border border-white/5 rounded-2xl p-4 hover:border-white/20 transition-all ${
              task.status === 'completed' ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <button 
                onClick={() => handleToggleStatus(task)}
                className={`mt-1 transition-colors ${
                  task.status === 'completed' ? 'text-emerald-500' : 'text-slate-600 hover:text-indigo-400'
                }`}
              >
                {task.status === 'completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h4 
                    onClick={() => openEdit(task)}
                    className={`font-bold text-white cursor-pointer hover:text-indigo-400 transition-colors ${
                      task.status === 'completed' ? 'line-through text-slate-500' : ''
                    }`}
                  >
                    {task.title}
                  </h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  {isOverdue(task.due_date) && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 uppercase tracking-wider animate-pulse">
                      <Clock size={12} /> Vencida
                    </span>
                  )}
                </div>
                
                {task.description && (
                  <p className="text-sm text-slate-400 line-clamp-2">{task.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-600" />
                    {new Date(task.due_date).toLocaleString()}
                  </div>
                  {task.contact && (
                    <div className="flex items-center gap-1.5 text-indigo-400">
                      <User size={14} />
                      {task.contact.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDeleteRequest(task)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <TaskFormSidebar
        open={sidebarOpen}
        task={editingTask}
        onClose={() => setSidebarOpen(false)}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Tarea"
        description={`¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.`}
        confirmText="Eliminar Tarea"
        variant="danger"
      />
    </div>
  );
};
