import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  className = 'btn btn-ghost btn-sm gap-1',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button type="button" className={className} onClick={handleCopy}>
      {copied ? (
        <Check size={14} className="text-success" />
      ) : (
        <Copy size={14} />
      )}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
};
