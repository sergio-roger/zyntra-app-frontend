import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Inbox, ListChecks, Loader2 } from 'lucide-react';
import { Tabs, TabItem } from '@core/ui/Tabs';
import { useFormTemplate } from '../hooks/use-forms';
import { FormDetailsTab } from '../components/tabs/FormDetailsTab';
import { FormFieldsTab } from '../components/tabs/FormFieldsTab';
import { FormSubmissionsTab } from '../components/tabs/FormSubmissionsTab';

type TabKey = 'details' | 'fields' | 'submissions';

export const FormDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { formId } = useParams<{ formId: string }>();
  const isCreate = !formId || formId === 'new';

  const { data: template, isLoading } = useFormTemplate(
    isCreate ? undefined : formId,
  );
  const [activeTab, setActiveTab] = useState<TabKey>('details');

  const tabs: TabItem<TabKey>[] = [
    { key: 'details', label: 'Detalles', icon: FileText },
    { key: 'fields', label: 'Campos', icon: ListChecks, disabled: isCreate },
    { key: 'submissions', label: 'Envíos', icon: Inbox, disabled: isCreate },
  ];

  if (!isCreate && isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-slate-500" />
      </div>
    );
  }

  if (!isCreate && !template) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-slate-400">No se encontró el formulario.</p>
        <button
          onClick={() => navigate('/automations/forms')}
          className="mt-4 text-sm text-link hover:underline"
        >
          Volver a formularios
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/automations/forms')}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/50 border border-white/5 text-slate-400 hover:text-white transition-colors"
          aria-label="Volver a formularios"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <FileText size={16} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {isCreate ? 'Nuevo formulario' : template?.name}
            </h2>
            {!isCreate && (
              <p className="text-xs text-slate-500 font-mono">{template?.slug}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-56 shrink-0">
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} orientation="vertical" />
        </div>

        <div className="flex-1 min-w-0 rounded-2xl border border-white/5 bg-slate-900/30 p-6">
          {activeTab === 'details' && (
            <FormDetailsTab
              template={template}
              onCreated={(created) => navigate(`/automations/forms/${created.id}`)}
            />
          )}

          {activeTab === 'fields' && template && (
            <FormFieldsTab template={template} />
          )}

          {activeTab === 'submissions' && template && (
            <FormSubmissionsTab templateId={template.id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FormDetailPage;
