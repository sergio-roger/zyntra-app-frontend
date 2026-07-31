import React, { useRef } from 'react';
import { Upload, Sparkles } from 'lucide-react';
import { Button } from '@core/ui/Button';

interface ProjectCoverUploaderProps {
  file: File | null;
  onFileSelected: (file: File) => void;
  aiPrompt: string;
  onAiPromptChange: (prompt: string) => void;
}

export const ProjectCoverUploader: React.FC<ProjectCoverUploaderProps> = ({
  file,
  onFileSelected,
  aiPrompt,
  onAiPromptChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
        Portada
      </span>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFileSelected(e.target.files[0])}
        />
        <Button type="button" variant="secondary" outline size="sm" icon={Upload} onClick={() => inputRef.current?.click()}>
          {file ? file.name : 'Subir imagen'}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <input
          aria-label="Prompt de portada IA"
          placeholder="Describí la portada para generarla con IA"
          className="input input-bordered input-sm flex-1 rounded-xl"
          value={aiPrompt}
          onChange={(e) => onAiPromptChange(e.target.value)}
        />
        <Sparkles size={14} className="text-primary shrink-0" />
      </div>
    </div>
  );
};

export default ProjectCoverUploader;
