import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, FileText, Workflow } from 'lucide-react';
import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';
import { Select } from '@core/ui/Select';
import {
  formTemplateSchema,
  FormTemplateFormValues,
} from '../../schemas/form-template.schema';
import { useCreateFormTemplate, useUpdateFormTemplate } from '../../hooks/use-forms';
import { FormStatus, FormSubmitAction, FormTemplate } from '../../types/forms';

const STATUS_OPTIONS = [
  { value: FormStatus.DRAFT, label: 'Borrador' },
  { value: FormStatus.PUBLISHED, label: 'Publicado' },
  { value: FormStatus.ARCHIVED, label: 'Archivado' },
];

const SUBMIT_ACTION_OPTIONS = [
  { value: FormSubmitAction.CREATE_CONTACT, label: 'Crear contacto' },
  { value: FormSubmitAction.CREATE_LEAD, label: 'Crear lead' },
  { value: FormSubmitAction.WEBHOOK_ONLY, label: 'Solo webhook' },
  { value: FormSubmitAction.CUSTOM, label: 'Personalizado (Workflows)' },
];

const DIACRITICS_RE = new RegExp('[̀-ͯ]', 'g');

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS_RE, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

interface FormDetailsTabProps {
  template: FormTemplate | undefined;
  onCreated: (template: FormTemplate) => void;
}

const defaultValues = (
  template: FormTemplate | undefined,
): FormTemplateFormValues => ({
  name: template?.name ?? '',
  slug: template?.slug ?? '',
  description: template?.description ?? '',
  status: template?.status ?? FormStatus.DRAFT,
  submitAction: template?.submitAction ?? FormSubmitAction.CREATE_CONTACT,
  successMessage: template?.successMessage ?? '',
});

export const FormDetailsTab: React.FC<FormDetailsTabProps> = ({
  template,
  onCreated,
}) => {
  const createTemplate = useCreateFormTemplate();
  const updateTemplate = useUpdateFormTemplate(template?.id ?? '');

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormTemplateFormValues>({
    resolver: zodResolver(formTemplateSchema),
    values: defaultValues(template),
  });

  const [slugTouched, setSlugTouched] = React.useState(!!template);

  const onSubmit = async (data: FormTemplateFormValues) => {
    const payload = {
      name: data.name,
      slug: data.slug,
      description: data.description || undefined,
      status: data.status,
      submitAction: data.submitAction,
      successMessage: data.successMessage || undefined,
    };

    if (template) {
      await updateTemplate.mutateAsync(payload);
    } else {
      const created = await createTemplate.mutateAsync(payload);
      onCreated(created);
    }
  };

  const isSaving =
    isSubmitting || createTemplate.isPending || updateTemplate.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nombre del formulario"
          icon={FileText}
          error={errors.name?.message}
          {...register('name', {
            onChange: (e) => {
              if (!slugTouched) {
                setValue('slug', slugify(e.target.value as string));
              }
            },
          })}
        />
        <Input
          label="Slug"
          className="font-mono"
          error={errors.slug?.message}
          {...register('slug', {
            onChange: () => setSlugTouched(true),
          })}
        />
      </div>

      <Textarea
        label="Descripción"
        rows={2}
        placeholder="Para qué se usa este formulario..."
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select
              label="Estado"
              options={STATUS_OPTIONS}
              value={field.value}
              onChange={(value) => field.onChange(value ?? FormStatus.DRAFT)}
            />
          )}
        />
        <Controller
          control={control}
          name="submitAction"
          render={({ field }) => (
            <Select
              label="Acción al enviar"
              icon={Workflow}
              options={SUBMIT_ACTION_OPTIONS}
              value={field.value}
              onChange={(value) =>
                field.onChange(value ?? FormSubmitAction.CREATE_CONTACT)
              }
            />
          )}
        />
      </div>

      <Textarea
        label="Mensaje de éxito"
        rows={2}
        placeholder="¡Gracias! Nos pondremos en contacto pronto."
        error={errors.successMessage?.message}
        {...register('successMessage')}
      />

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {template ? 'Guardar cambios' : 'Crear formulario'}
        </button>
      </div>
    </form>
  );
};
