import React, { useState, useEffect } from 'react';
import { Bot, Globe, MessageSquare, Settings, Send, Loader2, Plus, X, HelpCircle } from 'lucide-react';
import { aiApi, ChatbotConfig } from '@features/chatbot/api/aiApi';

const defaultConfig: ChatbotConfig = {
  id: '',
  business_id: '',
  name: 'Asistente Zyntra',
  tone: 'friendly',
  welcome_message: '¡Hola! ¿En qué puedo ayudarte hoy?',
  locale: 'es',
  is_active: true,
  system_prompt_extra: '',
  active_channels: ['web'],
  theme: {},
  faqs: [],
};

export const ChatbotPage: React.FC = () => {
  const [config, setConfig] = useState<ChatbotConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewMessage, setPreviewMessage] = useState('');
  const [previewResponse, setPreviewResponse] = useState('');

  const loadConfig = React.useCallback(async () => {
    try {
      const data = await aiApi.getOrCreateConfig();
      setConfig(data);
    } catch {
      setConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadConfig();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadConfig]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await aiApi.updateConfig(config);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Error saving:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    if (!previewMessage.trim()) return;

    setPreviewLoading(true);
    try {
      const data = await aiApi.preview({
        message: previewMessage,
        config: {
          tone: config.tone,
          welcome_message: config.welcome_message,
          system_prompt_extra: config.system_prompt_extra,
        },
      });
      setPreviewResponse(data.response || 'Sin respuesta');
    } catch {
      setPreviewResponse('Error al conectar con la IA');
    } finally {
      setPreviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Chatbot</h1>
        <p className="text-base-content/60">Configura tu asistente de IA</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card bg-base-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bot size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Configuración General</h2>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Nombre del bot</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
            />
          </div>

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Tono</span>
            </label>
            <select
              className="select select-bordered"
              value={config.tone}
              onChange={(e) => setConfig({ ...config, tone: e.target.value })}
            >
              <option value="formal">Formal</option>
              <option value="friendly">Amigable</option>
              <option value="professional">Profesional</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Idioma</span>
            </label>
            <select
              className="select select-bordered"
              value={config.locale}
              onChange={(e) => setConfig({ ...config, locale: e.target.value })}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div className="form-control mt-4">
            <label className="label cursor-pointer">
              <span className="label-text">Bot activo</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={config.is_active}
                onChange={(e) => setConfig({ ...config, is_active: e.target.checked })}
              />
            </label>
          </div>
        </div>

        <div className="card bg-base-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare size={20} className="text-secondary" />
            <h2 className="text-lg font-semibold">Mensajes</h2>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Mensaje de bienvenida</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              rows={3}
              value={config.welcome_message}
              onChange={(e) => setConfig({ ...config, welcome_message: e.target.value })}
            />
          </div>

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Prompt adicional (opcional)</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              rows={2}
              placeholder="Instrucciones extra para el chatbot..."
              value={config.system_prompt_extra}
              onChange={(e) => setConfig({ ...config, system_prompt_extra: e.target.value })}
            />
          </div>
        </div>

        <div className="card bg-base-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe size={20} className="text-accent" />
            <h2 className="text-lg font-semibold">Canales</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="badge badge-primary gap-2">
              <Globe size={14} /> Web
            </span>
            <span className="badge badge-outline gap-2">
              WhatsApp
            </span>
            <span className="badge badge-outline gap-2">
              Instagram
            </span>
          </div>
        </div>

        <div className="card bg-base-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings size={20} className="text-info" />
            <h2 className="text-lg font-semibold">Avanzado</h2>
          </div>

          <p className="text-sm text-base-content/60">
            Configura el prompt del sistema, integraciones y más opciones avanzadas.
          </p>
        </div>
      </div>

        <div className="card bg-base-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <HelpCircle size={20} className="text-warning" />
              <h2 className="text-lg font-semibold">Preguntas Frecuentes (FAQs)</h2>
            </div>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => setConfig({ ...config, faqs: [...(config.faqs || []), { question: '', answer: '' }] })}
            >
              <Plus size={14} className="mr-1" /> Agregar
            </button>
          </div>

          {(config.faqs || []).length === 0 ? (
            <p className="text-sm text-base-content/60">
              Agrega preguntas y respuestas frecuentes para que el chatbot pueda atender mejor.
            </p>
          ) : (
            <div className="space-y-4">
              {(config.faqs || []).map((faq, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1 grid gap-2">
                    <input
                      type="text"
                      className="input input-bordered input-sm"
                      placeholder="Pregunta"
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...(config.faqs || [])];
                        newFaqs[index] = { ...newFaqs[index], question: e.target.value };
                        setConfig({ ...config, faqs: newFaqs });
                      }}
                    />
                    <input
                      type="text"
                      className="input input-bordered input-sm"
                      placeholder="Respuesta"
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...(config.faqs || [])];
                        newFaqs[index] = { ...newFaqs[index], answer: e.target.value };
                        setConfig({ ...config, faqs: newFaqs });
                      }}
                    />
                  </div>
                  <button
                    className="btn btn-sm btn-ghost text-error"
                    onClick={() => {
                      const newFaqs = (config.faqs || []).filter((_, i) => i !== index);
                      setConfig({ ...config, faqs: newFaqs });
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      <div className="divider">Vista Previa</div>

      <div className="card bg-base-200 p-6">
        <h3 className="font-semibold mb-4">Prueba tu chatbot</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="input input-bordered flex-1"
            placeholder="Escribe un mensaje..."
            value={previewMessage}
            onChange={(e) => setPreviewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePreview()}
          />
          <button
            className="btn btn-primary"
            onClick={handlePreview}
            disabled={previewLoading || !previewMessage.trim()}
          >
            {previewLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>

        {previewResponse && (
          <div className="chat chat-start">
            <div className="chat-header text-xs opacity-50">IA</div>
            <div className="chat-bubble chat-bubble-primary">
              {previewResponse}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 size={18} className="animate-spin" /> : saved ? '¡Guardado!' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;