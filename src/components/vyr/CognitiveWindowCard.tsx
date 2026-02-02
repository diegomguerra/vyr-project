// VYR Labs - Card de Janela Cognitiva
// Indica proativamente quando há condições ideais para foco

import { Clock } from "lucide-react";
import type { CognitiveWindow as CognitiveWindowType } from "@/lib/vyr-types";

interface CognitiveWindowProps {
  window: CognitiveWindowType;
}

export function CognitiveWindowCard({ window }: CognitiveWindowProps) {
  if (!window.available) {
    return null;
  }

  return (
    <div className="bg-vyr-bg-surface border border-vyr-accent-action/20 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-vyr-accent-action" />
        <span className="text-vyr-accent-action text-xs font-medium tracking-wider uppercase">
          Janela cognitiva
        </span>
      </div>
      
      <p className="text-vyr-text-primary text-sm mb-2">
        Próximas <span className="font-medium">{window.duration}</span> são favoráveis
        para foco profundo.
      </p>
      
      <p className="text-vyr-text-muted text-sm">
        {window.suggestion}
      </p>
    </div>
  );
}
