import { TaskFormSidebar } from '@crm/components/TaskFormSidebar';
import { useCrmTasks, useDeleteTask, useUpdateTask } from '@crm/hooks/useCrmTasks';
import { TaskStatus } from '@crm/types/crm';
import { CrmTask } from '@crm/types/crm-task';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { Calendar, CheckCircle2, Circle, Clock, Loader2, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface TaskBoardProps {
  dealId?: string;
  contactId?: string;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ dealId, contactId }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CrmTask | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<CrmTask | null>(null);

  const { data: tasks = [], isLoading } = useCrmTasks({
    dealId,
    contactId,
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
      setIsConfirmOpen(false);
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

  const isOverdue = (date: string, status: string) => {
    return new Date(date) < new Date() && status !== 'completed';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white">Tareas</h4>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors border border-indigo-500/20 hover:border-indigo-500/40"
        >
          <Plus size={14} /> Nueva Tarea
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center p-6 bg-slate-900/50 rounded-xl border border-white/5">
          <p className="text-xs text-slate-500">No hay tareas vinculadas.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`group bg-slate-900/50 border border-white/5 rounded-xl p-3 hover:border-white/20 transition-all ${
                task.status === 'completed' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleStatus(task)}
                  className={`mt-0.5 transition-colors ${
                    task.status === 'completed'
                      ? 'text-emerald-500'
                      : 'text-slate-600 hover:text-indigo-400'
                  }`}
                >
                  {task.status === 'completed' ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h5
                      onClick={() => openEdit(task)}
                      className={`text-sm font-bold text-white truncate cursor-pointer hover:text-indigo-400 transition-colors ${
                        task.status === 'completed' ? 'line-through text-slate-500' : ''
                      }`}
                    >
                      {task.title}
                    </h5>
                    <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    {isOverdue(task.dueDate, task.status) && (
                      <span className="shrink-0 flex items-center gap-1 text-[9px] font-bold text-rose-400 uppercase tracking-wider animate-pulse">
                        <Clock size={10} /> Vencida
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[10px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-slate-600" />
                      {new Date(task.dueDate).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDeleteRequest(task)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskFormSidebar
        open={sidebarOpen}
        task={editingTask}
        contactId={contactId}
        dealId={dealId}
        onClose={() => setSidebarOpen(false)}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Tarea"
        description="¿Estás seguro de que deseas eliminar esta tarea?"
        confirmText="Eliminar Tarea"
        variant="danger"
      />
    </div>
  );
};
