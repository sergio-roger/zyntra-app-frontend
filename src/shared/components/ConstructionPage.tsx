import React from 'react';
import {
  Hammer,
  ArrowLeft,
  LayoutDashboard,
  Sparkles,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ConstructionPageProps {
  title?: string;
  description?: string;
}

export const ConstructionPage: React.FC<ConstructionPageProps> = ({
  title = '¡Estamos construyendo algo increíble!',
  description = 'Esta sección está siendo desarrollada por nuestro equipo de ingeniería para ofrecerte la mejor experiencia posible. Estará lista muy pronto.',
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
        <div className="relative bg-base-200 p-8 rounded-3xl border border-base-content/5 shadow-2xl">
          <Hammer className="h-20 w-20 text-primary animate-bounce" />
          <div className="absolute -right-2 -top-2 flex h-8 w-8 animate-pulse items-center justify-center rounded-full bg-secondary text-secondary-content shadow-lg">
            <Sparkles size={16} />
          </div>
        </div>
      </div>

      <h1 className="text-4xl font-black text-base-content mb-4 tracking-tight max-w-2xl mx-auto md:text-5xl">
        {title.includes('increíble') ? (
          <>
            ¡Estamos construyendo algo{' '}
            <span className="text-primary italic">increíble</span>!
          </>
        ) : (
          title
        )}
      </h1>

      <p className="text-base-content/60 max-w-md mx-auto mb-10 text-lg leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <div className="flex items-center gap-2 rounded-full bg-base-200 px-4 py-2 text-xs font-medium text-base-content/70 border border-base-content/5">
          <Clock size={14} className="text-primary" />
          <span>Lanzamiento: Próximamente</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-medium text-primary border border-primary/20">
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span>Desarrollo en curso</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost gap-2 px-8"
        >
          <ArrowLeft size={18} />
          Volver atrás
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-primary gap-2 px-8 shadow-lg shadow-primary/20"
        >
          <LayoutDashboard size={18} />
          Ir al Dashboard
        </button>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full opacity-40 grayscale">
        <div className="p-4 border border-dashed border-base-content/20 rounded-2xl">
          <div className="h-2 w-12 bg-base-content/20 rounded mb-2"></div>
          <div className="h-2 w-20 bg-base-content/10 rounded"></div>
        </div>
        <div className="p-4 border border-dashed border-base-content/20 rounded-2xl">
          <div className="h-2 w-12 bg-base-content/20 rounded mb-2"></div>
          <div className="h-2 w-20 bg-base-content/10 rounded"></div>
        </div>
        <div className="p-4 border border-dashed border-base-content/20 rounded-2xl">
          <div className="h-2 w-12 bg-base-content/20 rounded mb-2"></div>
          <div className="h-2 w-20 bg-base-content/10 rounded"></div>
        </div>
      </div>
    </div>
  );
};
