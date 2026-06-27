import { Input } from "@core/ui/Input";
import { useCustomFields } from "@crm/hooks/useCustomFields";
import { useUpdateContact } from "@crm/hooks/useContacts";
import { Contact } from "@crm/types/contact";
import { Loader2, Save, Settings2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ContactCustomFieldsSidebarProps {
  open: boolean;
  contact: Contact | null;
  onClose: () => void;
}

export const ContactCustomFieldsSidebar: React.FC<
  ContactCustomFieldsSidebarProps
> = ({ open, contact, onClose }) => {
  const { data: fields = [] } = useCustomFields();
  const updateMutation = useUpdateContact();
  const [values, setValues] = useState<Record<string, any>>({});
  const navigate = useNavigate();

  useEffect(() => {
    setValues(contact?.customFields ?? {});
  }, [contact, open]);

  const activeFields = fields.filter((f) => f.is_active);

  const handleSave = async () => {
    if (!contact) return;
    await updateMutation.mutateAsync({
      id: contact.id,
      input: { customFields: values },
    });
    onClose();
  };

  const set = (name: string, value: any) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 !mt-0 backdrop-blur-sm z-[60] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 right-0 w-full !mt-0 max-w-md bg-slate-900 border-l border-white/10 z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div>
              <h3 className="text-xl font-bold text-white">
                Campos personalizados
              </h3>
              <p className="text-sm text-slate-400 mt-1">{contact?.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeFields.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-white/10 rounded-2xl">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 animate-pulse">
                  <Settings2 size={24} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  No hay campos personalizados
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mb-6">
                  Aún no has configurado campos personalizados activos. Configura campos para poder asociarlos a tus contactos.
                </p>
                <button
                  onClick={() => {
                    navigate("/crm/fields");
                    onClose();
                  }}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 animate-bounce"
                >
                  Configurar campos
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-2">
                  <Settings2 size={14} />
                  Información adicional
                </div>
                {activeFields.map((field) => (
                  <div key={field.id}>
                    {field.type === "select" ? (
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-400 ml-1">
                          {field.label}
                          {field.required && (
                            <span className="text-rose-400 ml-0.5">*</span>
                          )}
                        </label>
                        <select
                          value={values[field.name] || ""}
                          onChange={(e) => set(field.name, e.target.value)}
                          className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
                        >
                          <option value="">Seleccionar...</option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : field.type === "checkbox" ? (
                      <div className="flex items-center justify-between bg-slate-950/50 border border-white/10 rounded-xl p-4">
                        <label className="text-sm font-medium text-slate-300">
                          {field.label}
                          {field.required && (
                            <span className="text-rose-400 ml-0.5">*</span>
                          )}
                        </label>
                        <input
                          type="checkbox"
                          checked={!!values[field.name]}
                          onChange={(e) => set(field.name, e.target.checked)}
                          className="h-5 w-5 rounded border-white/10 bg-slate-800 text-primary focus:ring-primary/20"
                        />
                      </div>
                    ) : (
                      <Input
                        label={`${field.label}${field.required ? " *" : ""}`}
                        type={
                          field.type === "number"
                            ? "number"
                            : field.type === "date"
                              ? "date"
                              : field.type === "url"
                                ? "url"
                                : "text"
                        }
                        value={values[field.name] || ""}
                        onChange={(e) => set(field.name, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-white/5 bg-slate-950/30 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending || activeFields.length === 0}
              className="flex-[2] px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {updateMutation.isPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              Guardar campos
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
