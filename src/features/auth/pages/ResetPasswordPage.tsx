import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '@features/auth/components/AuthLayout';
import { ResetPasswordForm } from '@features/auth/components/ResetPasswordForm';

export const ResetPasswordPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <AuthLayout
        icon={<AlertTriangle className="text-white" size={28} />}
        title="Enlace inválido"
        subtitle="El enlace de restablecimiento es inválido o ha expirado"
        footer={
          <Link
            to="/forgot-password"
            className="font-medium text-link hover:underline"
          >
            Solicitar uno nuevo
          </Link>
        }
      >
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-center text-sm text-amber-200">
          Vuelve a la página de "Olvidé mi contraseña" para recibir un nuevo
          enlace.
        </div>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout
        icon={<CheckCircle2 className="text-white" size={28} />}
        title="Contraseña actualizada"
        subtitle="Ya puedes iniciar sesión con tu nueva contraseña"
      >
        <button
          onClick={() => navigate('/login')}
          className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-px hover:shadow-xl"
        >
          Ir al inicio de sesión
        </button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={<ShieldCheck className="text-white" size={28} />}
      title="Nueva contraseña"
      subtitle="Define una contraseña segura para tu cuenta"
      footer={
        <Link
          to="/login"
          className="font-medium text-indigo-400 hover:underline"
        >
          Cancelar
        </Link>
      }
    >
      <ResetPasswordForm token={token} onSuccess={() => setDone(true)} />
    </AuthLayout>
  );
};
