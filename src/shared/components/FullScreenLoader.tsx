import React from "react";
import { Loader2 } from "lucide-react";

export const FullScreenLoader: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950">
    <Loader2 size={32} className="animate-spin text-indigo-400" />
  </div>
);
