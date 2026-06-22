import React from 'react';
import { useAuthStore } from '@features/auth/store/authStore';
import { Check, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlanDetail {
  name: string;
  price: string;
  cycle: string;
  popular: boolean;
  color: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  features: string[];
}

export const PlansPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const currentPlanName = user?.plan?.name || '';

  const plans: PlanDetail[] = [
    {
      name: 'BrandStart',
      price: '$99',
      cycle: 'pago único',
      popular: false,
      color: 'from-blue-500 to-indigo-600',
      borderColor: 'border-base-300',
      badgeBg: 'bg-blue-500/10 text-blue-400',
      badgeText: 'Emprendedor',
      features: [
        'Diagnóstico del modelo de negocio',
        'Configuración de redes sociales (FB, IG, TikTok)',
        'Creación de logo (hasta 3 cambios)',
        'Configuración de WhatsApp Business + Catálogo',
        'Diseño visual (paleta de colores y tipografía)',
        'Bibliografías persuasivas optimizadas',
        'Guía de marca generada con IA',
      ],
    },
    {
      name: 'Impulse Pro',
      price: '$199',
      cycle: 'al mes',
      popular: true,
      color: 'from-primary to-secondary',
      borderColor: 'border-primary/50',
      badgeBg: 'bg-primary/20 text-primary',
      badgeText: 'Más Popular',
      features: [
        'Calendario Editorial de contenidos',
        'Creación y publicación de contenido',
        'Optimización continua de perfiles',
        'Gestión de campañas de Anuncios Meta',
        '9 Anuncios de Conversión incluidos',
        'Análisis mensual de métricas y campañas',
        'Chatbot 24/7 inteligente con IA',
      ],
    },
    {
      name: 'Core Digital',
      price: '$449',
      cycle: 'al mes',
      popular: false,
      color: 'from-purple-500 to-pink-600',
      borderColor: 'border-base-300',
      badgeBg: 'bg-purple-500/10 text-purple-400',
      badgeText: 'Empresarial',
      features: [
        'Plan BrandStart completamente incluido',
        'Plan Impulse Pro completamente incluido',
        'Asesoría estratégica quincenal',
        'Landing Page / Sitio web profesional',
        'Optimización SEO de motores de búsqueda',
        'CRM completo para gestión de clientes',
        'Agente de IA personalizado a tu negocio',
      ],
    },
  ];

  // Datos para la tabla comparativa
  const comparisons = [
    { category: 'Límites de Capacidad', isHeader: true },
    { name: 'Límite de usuarios', brand: '2', impulse: '5', core: '10' },
    { name: 'Límite de contactos', brand: '500', impulse: '5,000', core: 'Ilimitados' },
    { name: 'Tareas de CRM', brand: '10', impulse: '200', core: 'Ilimitadas' },
    { name: 'Canales de mensajería', brand: '1 canal', impulse: '3 canales', core: 'Ilimitados' },
    
    { category: 'Inteligencia Artificial', isHeader: true },
    { name: 'Agentes de IA', brand: false, impulse: '1 agente', core: '10 agentes' },
    { name: 'Chatbots con IA', brand: false, impulse: '1 chatbot', core: '5 chatbots' },
    { name: 'Guía de marca con IA', brand: true, impulse: true, core: true },
    
    { category: 'Módulos y Herramientas', isHeader: true },
    { name: 'Panel de Control (Dashboard)', brand: true, impulse: true, core: true },
    { name: 'Módulo de Facturación', brand: true, impulse: true, core: true },
    { name: 'CRM (Gestión de Clientes)', brand: false, impulse: true, core: true },
    { name: 'Inbox Integrado (Bandeja)', brand: false, impulse: true, core: true },
    { name: 'Módulo de Analíticas', brand: false, impulse: true, core: true },
    { name: 'Embudos de Venta (Funnels)', brand: false, impulse: false, core: true },
    { name: 'Clonación de Avatar', brand: false, impulse: false, core: true },
    
    { category: 'Servicios e Implementación', isHeader: true },
    { name: 'Creación de Logo y Marca', brand: true, impulse: false, core: true },
    { name: 'Configuración Redes Sociales', brand: true, impulse: false, core: true },
    { name: 'Landing Page (Sitio Web)', brand: false, impulse: false, core: true },
    { name: 'Optimización SEO', brand: false, impulse: false, core: true },
    { name: 'Asesoría y Soporte', brand: 'Autónomo', impulse: 'Soporte Básico', core: 'Asesoría Quincenal' },
  ];

  const renderValue = (val: boolean | string) => {
    if (typeof val === 'boolean') {
      return val ? (
        <span className="inline-flex items-center justify-center p-1 rounded-full bg-success/10 text-success">
          <Check size={16} strokeWidth={3} />
        </span>
      ) : (
        <span className="inline-flex items-center justify-center p-1 rounded-full bg-error/10 text-error">
          <X size={16} strokeWidth={3} />
        </span>
      );
    }
    return <span className="font-semibold text-base-content/85 text-sm">{val}</span>;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-base-content sm:text-5xl">
          Nuestros <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Planes</span>
        </h1>
        <p className="mt-4 text-lg text-base-content/60 max-w-2xl mx-auto">
          Elige el plan ideal para escalar tu negocio y potenciar tus ventas con agentes inteligentes de IA.
        </p>
      </div>

      {/* Grid de planes (solo características) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
        {plans.map((plan) => {
          const isCurrent = currentPlanName.toLowerCase() === plan.name.toLowerCase();

          return (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between rounded-3xl bg-base-200 border transition-all duration-300 ${
                isCurrent 
                  ? 'border-primary ring-2 ring-primary/20 scale-[1.02] shadow-2xl' 
                  : `${plan.borderColor} hover:border-base-content/20 hover:shadow-xl`
              }`}
            >
              {/* Badge superior si es popular o actual */}
              <div className="absolute -top-3.5 right-6 flex gap-2">
                {isCurrent && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success text-success-content px-3 py-1 text-xs font-bold shadow-md">
                    <Check size={12} strokeWidth={3} /> Plan Actual
                  </span>
                )}
                {plan.popular && !isCurrent && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-content px-3 py-1 text-xs font-bold shadow-md">
                    <Sparkles size={12} /> Popular
                  </span>
                )}
              </div>

              {/* Contenido Superior */}
              <div className="p-8 pb-0">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${plan.badgeBg}`}>
                    {plan.badgeText}
                  </span>
                </div>

                <h3 className="mt-4 text-2xl font-bold text-base-content">{plan.name}</h3>

                <div className="mt-4 flex items-baseline text-base-content">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="ml-1 text-base-content/60 text-sm">/{plan.cycle}</span>
                </div>
              </div>

              {/* Lista de características completas */}
              <div className="p-8 pt-6 flex-grow">
                <div className="h-px bg-base-300 mb-6" />
                <p className="text-xs font-bold uppercase tracking-wider text-base-content/40 mb-4">¿Qué incluye?</p>
                <ul className="space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-success/15 p-0.5 text-success">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-base-content/80 leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botón de acción */}
              <div className="p-8 pt-0 mt-auto">
                <button
                  onClick={() => navigate('/billing')}
                  className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 shadow-md ${
                    isCurrent
                      ? 'bg-base-300 text-base-content cursor-default border border-base-content/10 shadow-none'
                      : 'bg-gradient-to-r hover:opacity-90 active:scale-95 text-white ' + plan.color
                  }`}
                  disabled={isCurrent}
                >
                  {isCurrent ? 'Plan Actual' : 'Gestionar suscripción'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabla Comparativa */}
      <div className="bg-base-200 rounded-3xl border border-base-300 p-6 md:p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-base-content mb-6 text-center md:text-left">
          Comparativa detallada de características
        </h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-left">
            <thead>
              <tr className="border-b border-base-300 text-base-content/70">
                <th className="py-4 text-sm font-bold w-1/3">Características</th>
                <th className="py-4 text-sm font-bold text-center">BrandStart</th>
                <th className="py-4 text-sm font-bold text-center">Impulse Pro</th>
                <th className="py-4 text-sm font-bold text-center">Core Digital</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, idx) => {
                if (row.isHeader) {
                  return (
                    <tr key={idx} className="bg-base-300/40 border-b border-base-300">
                      <td colSpan={4} className="py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-primary">
                        {row.category}
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={idx} className="border-b border-base-300/50 hover:bg-base-300/20 transition-colors">
                    <td className="py-3.5 px-4 text-sm text-base-content/80 font-medium">{row.name}</td>
                    <td className="py-3.5 text-center">{renderValue(row.brand!)}</td>
                    <td className="py-3.5 text-center">{renderValue(row.impulse!)}</td>
                    <td className="py-3.5 text-center">{renderValue(row.core!)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
