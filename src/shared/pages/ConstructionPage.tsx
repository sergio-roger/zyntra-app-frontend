import React from 'react';
import { Hammer, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConstructionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
        <div className="relative bg-base-200 p-8 rounded-3xl border border-base-content/5 shadow-2xl">
          <Hammer className="h-20 w-20 text-primary animate-bounce" />
        </div>
      </div>

      <h1 className="text-4xl font-black text-base-content mb-4 tracking-tight">
        ¡Estamos construyendo algo{' '}
        <span className="text-primary italic">increíble</span>!
      </h1>

      <p className="text-base-content/60 max-w-md mx-auto mb-10 text-lg leading-relaxed">
        Esta sección está siendo desarrollada por nuestro equipo de ingeniería
        para ofrecerte la mejor experiencia posible. Estará lista muy pronto.
      </p>

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

export default ConstructionPage;
