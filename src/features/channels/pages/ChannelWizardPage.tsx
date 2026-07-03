import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Globe, Check, Copy, ArrowLeft, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useCreateChannel } from '../hooks/useChannels';

const STEPS = ['Información', 'Configuración', 'Listo'] as const;
type Step = 0 | 1 | 2;

interface WebChatConfig {
  position: 'bottom-right' | 'bottom-left';
  primaryColor: string;
  allowedDomains: string;
}

const DEFAULT_CONFIG: WebChatConfig = {
  position: 'bottom-right',
  primaryColor: '#6366f1',
  allowedDomains: '',
};

function StepIndicator({ current }: { current: Step }) {
  return (
    <ul className="steps steps-horizontal w-full mb-8">
      {STEPS.map((label, i) => (
        <li key={label} className={`step ${i <= current ? 'step-primary' : ''}`}>
          {label}
        </li>
      ))}
    </ul>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className="btn btn-ghost btn-sm gap-1" onClick={handleCopy}>
      {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
}

export const ChannelWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const typeId = params.get('type') ?? '';
  const typeKey = params.get('key') ?? 'web_chat';
  const typeLabel = params.get('label') ? decodeURIComponent(params.get('label')!) : 'Canal';

  const [step, setStep] = useState<Step>(0);
  const [name, setName] = useState('');
  const [webConfig, setWebConfig] = useState<WebChatConfig>(DEFAULT_CONFIG);
  const [embedCode, setEmbedCode] = useState('');
  const [formError, setFormError] = useState('');

  const { mutateAsync: createChannel, isPending } = useCreateChannel();

  const handleNext = async () => {
    if (step === 0) { setStep(1); return; }
    if (step === 1) {
      setFormError('');
      if (!name.trim()) { setFormError('El nombre del canal es requerido.'); return; }
      try {
        const config: Record<string, unknown> = {};
        if (typeKey === 'web_chat') {
          config.position = webConfig.position;
          config.primaryColor = webConfig.primaryColor;
          if (webConfig.allowedDomains.trim()) {
            config.allowedDomains = webConfig.allowedDomains
              .split(',')
              .map((d) => d.trim())
              .filter(Boolean);
          }
        }
        const channel = await createChannel({ channelTypeId: typeId, name: name.trim(), config });
        setEmbedCode(channel.embedCode ?? '');
        setStep(2);
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        setFormError(msg ?? 'Error al crear el canal. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        className="btn btn-ghost btn-sm gap-1 mb-6"
        onClick={() => (step === 0 ? navigate('/settings/channels') : setStep((s) => (s - 1) as Step))}
      >
        <ArrowLeft size={14} /> Volver
      </button>

      <h1 className="text-xl font-bold mb-2">Activar {typeLabel}</h1>
      <StepIndicator current={step} />

      {step === 0 && (
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Globe size={28} />
              </div>
              <div>
                <h2 className="font-semibold text-lg">{typeLabel}</h2>
                <p className="text-sm text-base-content/60">
                  {typeKey === 'web_chat'
                    ? 'Chat en tiempo real embebido en tu sitio web.'
                    : 'Canal de mensajería.'}
                </p>
              </div>
            </div>

            {typeKey === 'web_chat' && (
              <div className="bg-base-200 rounded-lg p-4 text-sm space-y-1">
                <p className="font-medium mb-2">¿Qué incluye?</p>
                <p>• Widget de chat para tu sitio web</p>
                <p>• Código de integración (script tag)</p>
                <p>• Asignación de agente de IA opcional</p>
                <p>• Historial de conversaciones en la bandeja</p>
              </div>
            )}

            <div className="card-actions justify-end">
              <button className="btn btn-primary gap-1" onClick={handleNext}>
                Comenzar configuración <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body gap-5">
            {formError && (
              <div className="alert alert-error text-sm">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <div className="form-control gap-1">
              <label className="label"><span className="label-text font-medium">Nombre del canal *</span></label>
              <input
                type="text"
                className="input input-bordered"
                placeholder="Ej. Chat Principal"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {typeKey === 'web_chat' && (
              <>
                <div className="form-control gap-1">
                  <label className="label"><span className="label-text font-medium">Posición del widget</span></label>
                  <select
                    className="select select-bordered"
                    value={webConfig.position}
                    onChange={(e) =>
                      setWebConfig((c) => ({ ...c, position: e.target.value as WebChatConfig['position'] }))
                    }
                  >
                    <option value="bottom-right">Inferior derecho</option>
                    <option value="bottom-left">Inferior izquierdo</option>
                  </select>
                </div>

                <div className="form-control gap-1">
                  <label className="label"><span className="label-text font-medium">Color principal</span></label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="w-12 h-10 rounded border border-base-300 cursor-pointer"
                      value={webConfig.primaryColor}
                      onChange={(e) => setWebConfig((c) => ({ ...c, primaryColor: e.target.value }))}
                    />
                    <input
                      type="text"
                      className="input input-bordered input-sm w-36"
                      value={webConfig.primaryColor}
                      onChange={(e) => setWebConfig((c) => ({ ...c, primaryColor: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-control gap-1">
                  <label className="label">
                    <span className="label-text font-medium">Dominios permitidos</span>
                    <span className="label-text-alt text-base-content/50">Separados por coma (opcional)</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    placeholder="tudominio.com, app.tudominio.com"
                    value={webConfig.allowedDomains}
                    onChange={(e) => setWebConfig((c) => ({ ...c, allowedDomains: e.target.value }))}
                  />
                </div>
              </>
            )}

            <div className="card-actions justify-between">
              <button className="btn btn-ghost gap-1" onClick={() => setStep(0)}>
                <ArrowLeft size={14} /> Atrás
              </button>
              <button className="btn btn-primary gap-1" onClick={handleNext} disabled={isPending}>
                {isPending ? <Loader2 size={14} className="animate-spin" /> : null}
                {isPending ? 'Creando...' : 'Crear canal'}
                {!isPending && <ArrowRight size={14} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center">
                <Check size={20} />
              </div>
              <div>
                <h2 className="font-semibold">¡Canal creado exitosamente!</h2>
                <p className="text-sm text-base-content/60">Copia el código e insértalo en tu sitio web.</p>
              </div>
            </div>

            {embedCode && (
              <div className="bg-base-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-base-content/60">Código de integración</span>
                  <CopyButton text={embedCode} />
                </div>
                <pre className="text-xs font-mono whitespace-pre-wrap break-all overflow-x-auto">
                  {embedCode}
                </pre>
              </div>
            )}

            <div className="bg-base-200 rounded-lg p-3 text-sm text-base-content/70">
              Pega este código antes del cierre de la etiqueta{' '}
              <code className="font-mono">&lt;/body&gt;</code> en tu sitio web.
            </div>

            <div className="card-actions justify-between">
              <button
                className="btn btn-ghost btn-sm gap-1"
                onClick={() => navigate('/settings/channels')}
              >
                Ver todos los canales
              </button>
              <button
                className="btn btn-primary gap-1"
                onClick={() => navigate('/settings/agents')}
              >
                Asignar agente de IA <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
