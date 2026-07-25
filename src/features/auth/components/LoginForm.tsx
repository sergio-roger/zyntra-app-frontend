import { FormField } from '@features/auth/components/FormField';
import { SubmitButton } from '@features/auth/components/SubmitButton';
import { useAuth } from '@features/auth/hooks/useAuth';
import { extractApiErrors } from '@features/auth/lib/mapAuthError';
import {
  LoginFormValues,
  loginSchema,
} from '@features/auth/schemas/login.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toastManager } from '@shared/components/toast/toastManager';
import { Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
      toastManager.add({
        title: '¡Bienvenido!',
        description: 'Sesión iniciada correctamente.',
        type: 'success',
      });
      onSuccess?.();
    } catch (err) {
      const apiErrors = extractApiErrors(err);

      for (const error of apiErrors) {
        // Errores de conectividad ya los notifica el interceptor global de axios.
        if (error.code === 'E_NETWORK' || error.code === 'E_TIMEOUT') continue;

        toastManager.add({
          title: 'Error de autenticación',
          description: error.description,
          type: 'error',
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <FormField
        label="Email"
        icon={Mail}
        type="email"
        placeholder="tu@email.com"
        autoComplete="email"
        error={errors.email?.message}
        disabled={isSubmitting}
        {...register('email')}
      />

      <div>
        <FormField
          label="Contraseña"
          icon={Lock}
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          disabled={isSubmitting}
          {...register('password')}
        />
        <div className="mt-2 flex items-center justify-between">
          <label className="mt-2 group flex cursor-pointer select-none items-center gap-2">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="sr-only"
            />
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border shadow-inner transition-all duration-200 ${
                showPassword
                  ? 'border-transparent bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/30'
                  : 'border-white/10 bg-slate-950/60 group-hover:border-white/20'
              }`}
            >
              {showPassword && (
                <svg
                  viewBox="0 0 10 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-2.5 w-2.5 text-white"
                >
                  <path d="M1 4l3 3 5-6" />
                </svg>
              )}
            </span>
            <span className="text-xs text-slate-400 transition-colors group-hover:text-slate-300">
              Ver contraseña
            </span>
          </label>
          <Link
            to="/forgot-password"
            className="mt-2 text-xs text-slate-400 transition-colors hover:text-link"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>

      <SubmitButton loading={isSubmitting}>Iniciar sesión</SubmitButton>
    </form>
  );
};
