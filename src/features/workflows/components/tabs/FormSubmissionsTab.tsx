import { ChevronLeft, ChevronRight, Inbox, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormSubmissions } from '../../hooks/use-forms';
import { FormSubmission } from '../../types/forms';

const PAGE_SIZE = 20;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-EC', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

const SubmissionDataPreview: React.FC<{ data: Record<string, unknown> }> = ({
  data,
}) => {
  const [expanded, setExpanded] = useState(false);
  const entries = Object.entries(data);
  const preview = entries.slice(0, 2);

  if (entries.length === 0) {
    return <span className="text-slate-600">Sin datos</span>;
  }

  if (expanded) {
    return (
      <div className="space-y-1">
        <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap break-all bg-slate-950/50 rounded-lg p-2">
          {JSON.stringify(data, null, 2)}
        </pre>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="text-[11px] text-link hover:underline"
        >
          Ocultar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {preview.map(([key, value]) => (
        <div key={key} className="text-xs text-slate-400 truncate">
          <span className="text-slate-500">{key}:</span> {String(value)}
        </div>
      ))}
      {entries.length > preview.length && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-[11px] text-link hover:underline"
        >
          Ver todo ({entries.length} campos)
        </button>
      )}
    </div>
  );
};

interface FormSubmissionsTabProps {
  templateId: string;
}

export const FormSubmissionsTab: React.FC<FormSubmissionsTabProps> = ({
  templateId,
}) => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useFormSubmissions(templateId, page, PAGE_SIZE);

  const submissions: FormSubmission[] = data?.items ?? [];
  const total = data?.total ?? 0;
  const hasNextPage = page * PAGE_SIZE < total;

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-16">
        <Loader2 size={20} className="animate-spin text-slate-500" />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <Inbox size={20} className="text-slate-600" />
        <p className="text-sm text-slate-500">
          Todavía no hay envíos para este formulario.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/50">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="border-b border-white/10 bg-slate-900/80 text-xs text-slate-400 uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Fecha</th>
              <th className="px-4 py-3 font-semibold">Canal</th>
              <th className="px-4 py-3 font-semibold">Contacto</th>
              <th className="px-4 py-3 font-semibold">Datos</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr
                key={submission.id}
                className="border-b border-white/5 last:border-0 align-top"
              >
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                  {formatDate(submission.createdAt)}
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {submission.sourceChannel ?? '—'}
                </td>
                <td className="px-4 py-3">
                  {submission.contactId ? (
                    <Link
                      to={`/crm/contacts/${submission.contactId}`}
                      className="text-link hover:underline"
                    >
                      Ver contacto
                    </Link>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <SubmissionDataPreview data={submission.data} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {total} envío{total !== 1 ? 's' : ''} en total
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft size={13} /> Anterior
          </button>
          <button
            type="button"
            disabled={!hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition-colors"
          >
            Siguiente <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
