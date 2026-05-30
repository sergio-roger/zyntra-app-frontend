import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authApi } from '@features/auth/api/authApi';
import { FormField } from '@features/auth/components/FormField';
import { SubmitButton } from '@features/auth/components/SubmitButton';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@features/auth/schemas/forgot-password.schema';
import { mapAuthError } from '@features/auth/lib/mapAuthError';

export const ForgotPasswordForm: React.FC = () => {
  const [serverError, setServerError] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setServerError('');
    try {
      await authApi.forgotPassword(data.email);
      setSubmittedEmail(data.email);
    } catch (err) {
      setServerError(mapAuthError(err));
    }
  };

  if (submittedEmail) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
        <CheckCircle2
          size={36}
          className="mx-auto mb-3 text-emerald-400"
          aria-hidden
        />
        <h3 className="font-semibold text-emerald-100">Revisa tu bandeja de entrada</h3>
        <p className="mt-2 text-sm text-emerald-200/80">
          Si <strong className="text-emerald-100">{submittedEmail}</strong> está
          registrado, te enviaremos un enlace para restablecer tu contraseña en los
          próximos minutos.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <FormField
        label="Email"
        icon={Mail}
        type="email"
        placeholder="tu@email.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
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

      <SubmitButton loading={isSubmitting}>Enviar enlace</SubmitButton>
    </form>
  );
};
