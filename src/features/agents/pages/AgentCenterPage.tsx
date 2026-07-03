import {
  BarChart,
  Bot,
  CheckCircle2,
  Clock,
  Eye,
  FileSearch,
  Loader2,
  MessageSquareText,
  Plus,
  Search,
  Share2,
  TrendingUp,
  XCircle,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAgentTasks } from "../hooks/use-agent-tasks";
import {
  AgentTask,
  AgentTaskStatus,
  AgentTaskType,
} from "@features/agents/types/agents";

export const AgentCenterPage: React.FC = () => {
  const { pathname } = useLocation();
  const { tasks, isLoading, isCreating, createTask } = useAgentTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AgentTask | null>(null);

  // Determinar el contexto basado en la ruta
  const context = useMemo(() => {
    if (pathname.includes("/strategy")) {
      return {
        type: AgentTaskType.SOCIAL,
        title: "Estrategia de Marca",
        desc: "Optimiza tu presencia y estrategia digital con IA.",
        icon: TrendingUp,
        placeholder: "Ej: Estrategia de crecimiento para mi tienda de ropa",
      };
    }
    if (pathname.includes("/analysis")) {
      return {
        type: AgentTaskType.CRM_ANALYSIS,
        title: "Análisis de Negocio",
        desc: "Analiza tus datos y obtén insights accionables.",
        icon: Search,
        placeholder: "Ej: Análisis de leads del último mes",
      };
    }
    return {
      type: AgentTaskType.CONTENT,
      title: "Generación de Contenido",
      desc: "Crea copys, blogs y guiones optimizados.",
      icon: MessageSquareText,
      placeholder: "Ej: 5 ideas de posts para Instagram sobre café",
    };
  }, [pathname]);

  const [formData, setFormData] = useState({
    topic: "",
    extra: "",
  });

  // Filtrar tareas por el tipo actual
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => t.type === context.type);
  }, [tasks, context.type]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask({
        type: context.type,
        input: {
          topic: formData.topic,
          extra_context: formData.extra,
        },
      });
      setIsModalOpen(false);
      setFormData({ topic: "", extra: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: AgentTaskType) => {
    switch (type) {
      case AgentTaskType.CONTENT:
        return <MessageSquareText size={20} />;
      case AgentTaskType.SOCIAL:
        return <Share2 size={20} />;
      case AgentTaskType.CHATBOT:
        return <Bot size={20} />;
      case AgentTaskType.CRM_ANALYSIS:
        return <FileSearch size={20} />;
      case AgentTaskType.REPORT:
        return <BarChart size={20} />;
    }
  };

  const getStatusBadge = (status: AgentTaskStatus) => {
    switch (status) {
      case AgentTaskStatus.PENDING:
        return (
          <div className="badge badge-ghost gap-2">
            <Clock size={12} /> Pendiente
          </div>
        );
      case AgentTaskStatus.RUNNING:
        return (
          <div className="badge badge-info gap-2 animate-pulse">
            <Loader2 size={12} className="animate-spin" /> Trabajando...
          </div>
        );
      case AgentTaskStatus.COMPLETED:
        return (
          <div className="badge badge-success gap-2">
            <CheckCircle2 size={12} /> Completado
          </div>
        );
      case AgentTaskStatus.FAILED:
        return (
          <div className="badge badge-error gap-2">
            <XCircle size={12} /> Error
          </div>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <context.icon size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{context.title}</h1>
            <p className="text-base-content/60 mt-1">{context.desc}</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary gap-2"
        >
          <Plus size={20} /> Nueva Tarea
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.length === 0 ? (
            <div className="card bg-base-200 border-2 border-dashed border-base-300 p-12 text-center">
              <Bot size={48} className="mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-semibold">
                No hay tareas de {context.title.toLowerCase()}
              </h3>
              <p className="text-base-content/60 mt-2">
                Comienza lanzando tu primera solicitud a los agentes.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-outline btn-primary mt-6 mx-auto"
              >
                Lanzar Agente
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow"
              >
                <div className="card-body py-4 flex-row items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      {getIcon(task.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-wider opacity-60">
                        {task.type.replace("_", " ")}
                      </h3>
                      <p className="text-base font-medium truncate max-w-md">
                        {(task.input.topic as string) || "Análisis de datos"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {getStatusBadge(task.status)}
                    <div className="text-xs text-base-content/50 hidden md:block">
                      {new Date(task.createdAt).toLocaleString()}
                    </div>
                    <button
                      onClick={() => setSelectedTask(task)}
                      disabled={task.status !== AgentTaskStatus.COMPLETED}
                      className="btn btn-ghost btn-sm btn-circle"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal: Crear Tarea */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-xl mb-6">
              Nuevo Agente: {context.title}
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tópico o Título</span>
                </label>
                <input
                  type="text"
                  placeholder={context.placeholder}
                  className="input input-bordered"
                  required
                  value={formData.topic}
                  onChange={(e) =>
                    setFormData({ ...formData, topic: e.target.value })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Instrucciones Extra (Opcional)
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Ej: Enfoque en público joven, tono divertido..."
                  value={formData.extra}
                  onChange={(e) =>
                    setFormData({ ...formData, extra: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="btn btn-primary"
                >
                  {isCreating && (
                    <Loader2 className="animate-spin mr-2" size={18} />
                  )}
                  Lanzar Crew
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Resultado de Tarea */}
      {selectedTask && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl max-h-[80vh]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-2xl">
                  {(selectedTask.input.topic as string) ||
                    "Resultado de la Tarea"}
                </h3>
                <p className="text-sm opacity-60">
                  Resultado del Agente de {selectedTask.type}
                </p>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="btn btn-sm btn-circle btn-ghost text-xl"
              >
                ✕
              </button>
            </div>

            <div className="prose max-w-none bg-base-200/50 p-6 rounded-xl border border-base-300 overflow-auto">
              <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                {typeof selectedTask.output === "string"
                  ? selectedTask.output
                  : (selectedTask.output?.output as string) ||
                    JSON.stringify(selectedTask.output, null, 2) ||
                    "No hay resultado disponible."}
              </pre>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setSelectedTask(null)}
                className="btn btn-primary"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentCenterPage;
