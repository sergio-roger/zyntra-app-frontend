import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, AlertCircle, Check, X } from 'lucide-react';
import { useAuth } from '@features/auth/hooks/useAuth';
import { FormField } from '@features/auth/components/FormField';
import { SubmitButton } from '@features/auth/components/SubmitButton';
import {
  registerSchema,
  RegisterFormValues,
} from '@features/auth/schemas/register.schema';
import { mapAuthError } from '@features/auth/lib/mapAuthError';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const checks = [
  { test: (p: string) => p.length >= 8, label: 'Al menos 8 caracteres' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'Una mayúscula' },
  { test: (p: string) => /[0-9]/.test(p), label: 'Un número' },
];

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  // react-hook-form's watch() cannot be safely auto-memoized by React Compiler
  'use no memo';

  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const password = watch('password');

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError('');
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      onSuccess?.();
    } catch (err) {
      setServerError(mapAuthError(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <FormField
        label="Nombre del negocio"
        icon={User}
        type="text"
        placeholder="Mi Negocio S.L."
        autoComplete="organization"
        error={errors.name?.message}
        {...register('name')}
      />

      <FormField
        label="Email"
        icon={Mail}
        type="email"
        placeholder="tu@email.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <FormField
        label="Contraseña"
        icon={Lock}
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {password && (
        <ul className="-mt-1 grid grid-cols-1 gap-1 text-xs sm:grid-cols-3">
          {checks.map(({ test, label }) => {
            const ok = test(password);
            return (
              <li
                key={label}
                className={`flex items-center gap-1.5 transition-colors ${
                  ok ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                {ok ? <Check size={12} /> : <X size={12} />}
                <span>{label}</span>
              </li>
            );
          })}
        </ul>
      )}

      <FormField
        label="Confirmar contraseña"
        icon={Lock}
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <SubmitButton loading={isSubmitting}>Crear cuenta</SubmitButton>

      <p className="text-center text-xs text-slate-500">
        Al registrarte, aceptas nuestros{' '}
        <a href="#" className="text-slate-400 hover:text-indigo-400">
          Términos
        </a>{' '}
        y{' '}
        <a href="#" className="text-slate-400 hover:text-indigo-400">
          Política de Privacidad
        </a>
        .
      </p>
    </form>
  );
};
