import React from "react";
import { Calendar, Building2 } from "lucide-react";
import { Contact } from "@crm/types/contact";

interface ContactCardProps {
  contact: Contact;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const formattedDate = contact.createdAt
    ? new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(contact.createdAt))
    : "Sin fecha";

  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-white/5 bg-slate-800/40 p-4 transition-all hover:bg-slate-800/60 hover:shadow-lg hover:shadow-black/20">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-semibold text-slate-100 line-clamp-1 group-hover:text-white">
            {contact.company?.name || contact.name}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Building2 size={12} />
            <span className="line-clamp-1">{contact.name}</span>
          </div>
        </div>
        {contact.lifecycleStage?.name?.toLowerCase().includes("client") && (
          <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-tight">
            Ganado
          </span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-3">
        <p className="text-sm font-bold text-white">
          ${Number(contact.dealValue || 0).toLocaleString()}
        </p>
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <Calendar size={10} />
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white border border-white/10 shadow-sm">
          {contact.name.charAt(0).toUpperCase()}
        </div>
        {contact.tags?.slice(0, 2).map((tag: any) => (
          <span
            key={tag.id}
            className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white shadow-sm"
            style={{ backgroundColor: tag.color || "#475569" }}
          >
            {tag.name}
          </span>
        ))}
        {contact.tags && contact.tags.length > 2 && (
          <span className="text-[10px] text-slate-500 font-medium">
            +{contact.tags.length - 2}
          </span>
        )}
      </div>
    </div>
  );
};
