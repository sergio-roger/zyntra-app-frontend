import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  ExternalLink,
  FileText,
  Loader2,
  RefreshCw,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import {
  useAgentKnowledgeDocuments,
  useKnowledgeDocumentPreview,
  useKnowledgeUsage,
  useRemoveKnowledgeDocument,
  useReprocessKnowledgeDocument,
  useUploadKnowledgeDocument,
} from '../../hooks/use-agent-knowledge';
import { Agent, KnowledgeDocument, KnowledgeDocumentStatus } from '../../types/automations';

interface PreviewState {
  fileName: string;
  fileType: string;
  url: string;
  content: string | null;
}

const DocumentPreviewModal: React.FC<{ preview: PreviewState; onClose: () => void }> = ({
  preview,
  onClose,
}) => {
  const canEmbed = preview.fileType === 'application/pdf';
  const hasTextContent = preview.content !== null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 !mt-0">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/5 px-5 py-3.5">
          <p className="truncate text-sm font-semibold text-slate-100">{preview.fileName}</p>
          <div className="flex items-center gap-1 shrink-0">
            <a
              href={preview.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-slate-200 transition-colors"
              aria-label="Abrir en una pestaña nueva"
            >
              <ExternalLink size={15} />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-slate-200 transition-colors"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 bg-slate-950">
          {canEmbed ? (
            <iframe src={preview.url} title={preview.fileName} className="h-full w-full" />
          ) : hasTextContent ? (
            <pre className="h-full w-full overflow-auto whitespace-pre-wrap break-words p-5 font-mono text-xs leading-relaxed text-slate-300">
              {preview.content}
            </pre>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
              <FileText size={28} className="text-slate-600" />
              <p className="text-sm text-slate-400">
                Este tipo de archivo no se puede previsualizar acá.
              </p>
              <a
                href={preview.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition-all"
              >
                <ExternalLink size={14} /> Abrir en una pestaña nueva
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ACCEPTED_MIME_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
  'text/markdown': ['.md'],
  'text/csv': ['.csv'],
};

const formatBytes = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

const StatusBadge: React.FC<{ status: KnowledgeDocumentStatus }> = ({ status }) => {
  switch (status) {
    case KnowledgeDocumentStatus.READY:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 size={11} /> Listo
        </span>
      );
    case KnowledgeDocumentStatus.FAILED:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400">
          <AlertCircle size={11} /> Falló
        </span>
      );
    case KnowledgeDocumentStatus.PROCESSING:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-400">
          <Loader2 size={11} className="animate-spin" /> Procesando
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-400">
          <Loader2 size={11} className="animate-spin" /> Pendiente
        </span>
      );
  }
};

const QuotaBar: React.FC<{ label: string; used: number; max: number; unit?: string }> = ({
  label,
  used,
  max,
  unit = '',
}) => {
  const pct = max > 0 ? Math.min(100, Math.round((used / max) * 100)) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-300 font-semibold">
          {used}
          {unit} / {max}
          {unit}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-rose-500' : 'bg-primary'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const DocumentRow: React.FC<{
  agentId: string;
  document: KnowledgeDocument;
  onPreview: (document: KnowledgeDocument) => void;
  isPreviewing: boolean;
}> = ({ agentId, document, onPreview, isPreviewing }) => {
  const removeDoc = useRemoveKnowledgeDocument(agentId);
  const reprocessDoc = useReprocessKnowledgeDocument(agentId);

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/50 p-3.5">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
        <FileText size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-100">{document.fileName}</p>
        <p className="truncate text-xs text-slate-500 mt-0.5">
          {formatBytes(document.fileSizeBytes)}
          {document.status === KnowledgeDocumentStatus.READY &&
            ` · ${document.chunkCount} fragmentos`}
          {document.status === KnowledgeDocumentStatus.FAILED &&
            document.errorMessage &&
            ` · ${document.errorMessage}`}
        </p>
      </div>
      <StatusBadge status={document.status} />
      <button
        type="button"
        onClick={() => onPreview(document)}
        disabled={document.status === KnowledgeDocumentStatus.PENDING || isPreviewing}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-slate-200 transition-colors disabled:opacity-50"
        aria-label="Previsualizar documento"
      >
        {isPreviewing ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
      </button>
      {document.status === KnowledgeDocumentStatus.FAILED && (
        <button
          type="button"
          onClick={() => reprocessDoc.mutate(document.id)}
          disabled={reprocessDoc.isPending}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-slate-200 transition-colors disabled:opacity-50"
          aria-label="Reprocesar documento"
        >
          {reprocessDoc.isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <RefreshCw size={14} />
          )}
        </button>
      )}
      <button
        type="button"
        onClick={() => removeDoc.mutate(document.id)}
        disabled={removeDoc.isPending}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors disabled:opacity-50"
        aria-label="Eliminar documento"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

interface KnowledgeTabProps {
  agent: Agent;
}

export const KnowledgeTab: React.FC<KnowledgeTabProps> = ({ agent }) => {
  const { data: documents = [], isLoading } = useAgentKnowledgeDocuments(agent.id);
  const { data: usage } = useKnowledgeUsage();
  const uploadDoc = useUploadKnowledgeDocument(agent.id);
  const previewDoc = useKnowledgeDocumentPreview(agent.id);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const handlePreview = useCallback(
    (document: KnowledgeDocument) => {
      setPreviewingId(document.id);
      previewDoc.mutate(document.id, {
        onSuccess: (data) => setPreview(data),
        onSettled: () => setPreviewingId(null),
      });
    },
    [previewDoc],
  );

  const onDrop = useCallback(
    (accepted: File[]) => {
      accepted.forEach((file) => uploadDoc.mutate(file));
    },
    [uploadDoc],
  );

  const maxFileSizeMb = usage?.limits.kbMaxFileSizeMb ?? 25;
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_MIME_TYPES,
    maxSize: maxFileSizeMb * 1024 * 1024,
    disabled: uploadDoc.isPending,
  });

  return (
    <div className="w-full space-y-6">
      {usage && (
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-white/5 bg-slate-900/50 p-4">
          <QuotaBar
            label="Documentos de este agente"
            used={documents.length}
            max={usage.limits.kbMaxDocumentsPerAgent}
          />
        </div>
      )}

      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-white/20'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud size={28} className="text-slate-500" />
        <p className="text-sm font-medium text-slate-300">
          {isDragActive ? 'Soltá el archivo acá' : 'Arrastrá un archivo o hacé clic para subir'}
        </p>
        <p className="text-xs text-slate-500">
          PDF, DOCX, TXT, MD o CSV · máx. {maxFileSizeMb}MB
        </p>
        {uploadDoc.isPending && (
          <span className="inline-flex items-center gap-1.5 text-xs text-primary mt-1">
            <Loader2 size={12} className="animate-spin" /> Subiendo...
          </span>
        )}
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 size={20} className="animate-spin text-slate-500" />
          </div>
        ) : documents.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            Todavía no subiste documentos para este agente.
          </p>
        ) : (
          documents.map((doc) => (
            <DocumentRow
              key={doc.id}
              agentId={agent.id}
              document={doc}
              onPreview={handlePreview}
              isPreviewing={previewingId === doc.id}
            />
          ))
        )}
      </div>

      {preview && <DocumentPreviewModal preview={preview} onClose={() => setPreview(null)} />}
    </div>
  );
};
