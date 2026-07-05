import React from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { AuthLayout } from '@features/auth/components/AuthLayout';
import { ForgotPasswordForm } from '@features/auth/components/ForgotPasswordForm';

export const ForgotPasswordPage: React.FC = () => {
  return (
    <AuthLayout
      icon={<KeyRound className="text-white" size={28} />}
      title="¿Olvidaste tu contraseña?"
      subtitle="Te enviaremos un enlace para restablecerla"
      footer={
        <>
          ¿Recordaste tu contraseña?{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-400 hover:underline"
          >
            Volver al inicio de sesión
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
};
