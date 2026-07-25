import { Check, Copy } from 'lucide-react';
import React, { useState } from 'react';

interface CopyButtonProps {
  text: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handle = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button className="btn btn-ghost btn-sm gap-1" onClick={handle}>
      {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
};
