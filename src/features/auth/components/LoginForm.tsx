import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@features/auth/hooks/useAuth';
import { FormField } from '@features/auth/components/FormField';
import { SubmitButton } from '@features/auth/components/SubmitButton';
import { loginSchema, LoginFormValues } from '@features/auth/schemas/login.schema';
import { extractApiErrors } from '@features/auth/lib/mapAuthError';
import { toastManager } from '@shared/components/toast/toastManager';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login } = useAuth();

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
        toastManager.add({
          title: 'Error de autenticación',
          description: error.description,
          type: 'error',
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
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
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          disabled={isSubmitting}
          {...register('password')}
        />
        <div className="mt-2 text-right">
          <Link
            to="/forgot-password"
            className="text-xs text-slate-400 transition-colors hover:text-indigo-400"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>

      <SubmitButton loading={isSubmitting}>Iniciar sesión</SubmitButton>
    </form>
  );
};
