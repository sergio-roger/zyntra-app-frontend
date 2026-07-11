import { Accordion } from '@core/ui/Accordion';
import { useContact } from '@crm/hooks/useContacts';
import { useCustomFields } from '@crm/hooks/useCustomFields';
import { Avatar } from '@shared/components/Avatar';
import { Globe, ListChecks, Loader2, Mail, Phone, Tag as TagIcon } from 'lucide-react';
import React from 'react';

interface ContactPanelProps {
  contactId: string | null | undefined;
  fallbackName: string;
  channel: string;
  startedAt: string;
  visitor?: Record<string, unknown>;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const ContactPanel: React.FC<ContactPanelProps> = ({
  contactId,
  fallbackName,
  channel,
  startedAt,
  visitor,
}) => {
  const { data: contact, isLoading } = useContact(contactId ?? null);
  const { data: customFieldDefs = [] } = useCustomFields('contact');

  const pageUrl = typeof visitor?.page_url === 'string' ? visitor.page_url : undefined;

  return (
    <div className="card bg-base-200 p-4 flex flex-col gap-4 overflow-y-auto">
      <div className="flex flex-col items-center text-center gap-2 pb-4 border-b border-base-300">
        <Avatar name={contact?.name ?? fallbackName} email={contact?.email} size={64} />
        <div>
          <p className="font-semibold">{contact?.name ?? fallbackName}</p>
          {contact?.email && (
            <p className="text-xs text-base-content/60">{contact.email}</p>
          )}
        </div>
      </div>

      {isLoading && contactId ? (
        <div className="flex justify-center py-4">
          <Loader2 size={20} className="animate-spin text-primary" />
        </div>
      ) : !contact ? (
        <p className="text-xs text-base-content/50 text-center">
          Sin contacto vinculado aún — se crea al capturar el lead.
        </p>
      ) : (
        <>
          {(contact.email || contact.phone) && (
            <div className="space-y-2 text-sm">
              {contact.email && (
                <div className="flex items-center gap-2 text-base-content/70">
                  <Mail size={14} className="shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2 text-base-content/70">
                  <Phone size={14} className="shrink-0" />
                  {contact.phone}
                </div>
              )}
            </div>
          )}

          {contact.tags.length > 0 && (
            <div>
              <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TagIcon size={12} /> Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {contact.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="badge badge-sm text-white border-none"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {customFieldDefs.length > 0 && (
            <Accordion title="Campos personalizados" icon={ListChecks} defaultOpen>
              <div className="space-y-2 text-sm">
                {customFieldDefs.map((field) => {
                  const value = contact.customFields?.[field.name];
                  const display =
                    value !== undefined && value !== null && value !== ''
                      ? String(value)
                      : '—';
                  return (
                    <div
                      key={field.id}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="text-base-content/50">{field.label}</span>
                      <span className="font-medium text-right truncate">
                        {display}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Accordion>
          )}
        </>
      )}

      <div className="pt-4 border-t border-base-300 space-y-2 text-sm">
        <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-1">
          Conversación
        </p>
        <div className="flex items-center justify-between">
          <span className="text-base-content/50">Canal</span>
          <span className="font-medium">{channel}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base-content/50">Iniciada</span>
          <span className="font-medium">{formatDate(startedAt)}</span>
        </div>
        {pageUrl && (
          <div className="flex items-center gap-2 text-base-content/60">
            <Globe size={12} className="shrink-0" />
            <span className="truncate">{pageUrl}</span>
          </div>
        )}
      </div>
    </div>
  );
};
