import React from 'react';
import { Sparkles, Bot, BarChart3, MessageSquare } from 'lucide-react';

interface AuthLayoutProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const features = [
  { icon: Bot, label: 'Agentes IA multitarea trabajando 24/7' },
  { icon: MessageSquare, label: 'Chatbots y CRM unificados' },
  { icon: BarChart3, label: 'Analítica de marketing en tiempo real' },
];

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  icon,
  title,
  subtitle,
  children,
  footer,
}) => {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-fuchsia-600/15 blur-[120px]" />
      </div>

      {/* Branding panel — desktop only */}
      <aside className="relative z-10 hidden w-1/2 flex-col justify-between p-12 lg:flex xl:p-16">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/40">
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Zyntra</span>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="bg-gradient-to-r from-white via-indigo-100 to-violet-200 bg-clip-text text-4xl leading-tight font-bold text-transparent xl:text-5xl">
              Marketing impulsado por IA para tu negocio.
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Una plataforma. Múltiples agentes. Resultados medibles.
            </p>
          </div>

          <ul className="space-y-4">
            {features.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 text-slate-300"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Icon size={18} className="text-indigo-400" />
                </span>
                <span className="text-sm">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Zyntra · Todos los derechos reservados
        </p>
      </aside>

      {/* Form panel */}
      <main className="relative z-10 flex w-full flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Zyntra</span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl sm:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/40 ring-1 ring-white/20">
                {icon}
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {title}
              </h1>
              <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
            </div>

            {children}

            {footer && (
              <p className="mt-8 text-center text-sm text-slate-400">
                {footer}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
