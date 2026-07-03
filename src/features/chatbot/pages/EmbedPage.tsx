import { useState } from "react";
import { Copy, Check, ExternalLink, Code } from "lucide-react";
import { useAuthStore } from "@features/auth/store/authStore";

export const EmbedPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const businessId = useAuthStore((s) => s.user?.id);

  const snippet = businessId
    ? `<script src="https://cdn.zyntra.app/widget/v1.js" data-business-id="${businessId}" defer></script>`
    : "";

  const handleCopy = async () => {
    if (!snippet) return;
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Code size={48} className="text-base-content/30 mb-4" />
        <p className="text-base-content/60">Configura tu negocio primero</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Widget Embebido</h1>
        <p className="text-base-content/60">
          Copia el código y pégalo en tu sitio web
        </p>
      </div>

      <div className="card bg-base-200 p-6">
        <h2 className="font-semibold mb-4">Código de integración</h2>

        <div className="relative">
          <pre className="bg-base-300 p-4 rounded-lg overflow-x-auto text-sm font-mono">
            {snippet}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 btn btn-sm btn-ghost"
          >
            {copied ? (
              <Check size={16} className="text-success" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>

        <p className="mt-4 text-sm text-base-content/60">
          El widget aparecerá como un botón flotante en tu sitio web.
        </p>
      </div>

      <div className="card bg-base-200 p-6">
        <h2 className="font-semibold mb-4">Vista previa</h2>
        <p className="text-base-content/60 text-sm">
          Para ver el widget en acción, visita tu sitio web con el código
          insertado.
        </p>

        <a
          href="#"
          className="mt-4 btn btn-outline btn-sm gap-2"
          onClick={(e) => {
            e.preventDefault();
            window.open("https://docs.zyntra.app/widget", "_blank");
          }}
        >
          <ExternalLink size={14} />
          Ver documentación
        </a>
      </div>

      <div className="card bg-base-200 p-6">
        <h2 className="font-semibold mb-4">Opciones</h2>

        <div className="form-control">
          <label className="cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              defaultChecked
            />
            <span className="label-text">Widget activo por defecto</span>
          </label>
        </div>

        <div className="form-control mt-4">
          <label className="cursor-pointer justify-start gap-3">
            <input type="checkbox" className="toggle toggle-primary" />
            <span className="label-text">
              Mostrar solo en páginas específicas
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default EmbedPage;
