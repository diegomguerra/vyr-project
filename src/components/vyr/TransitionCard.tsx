// VYR Labs - Card de Transição Sugerida
// O sistema indica quando mudar de fase (BOOT → HOLD → CLEAR)

import { Lightbulb, Play } from "lucide-react";
import type { SuggestedTransition, MomentAction } from "@/lib/vyr-types";

interface TransitionCardProps {
  transition: SuggestedTransition;
  onActivate: (action: MomentAction) => void;
  onViewDetails?: () => void;
}

const ACTION_LABELS: Record<MomentAction, string> = {
  BOOT: "BOOT",
  HOLD: "HOLD",
  CLEAR: "CLEAR",
};

export function TransitionCard({ transition, onActivate, onViewDetails }: TransitionCardProps) {
  if (!transition.available) {
    return null;
  }

  return (
    <div className="bg-vyr-bg-surface border border-vyr-accent-transition/30 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-vyr-accent-transition" />
        <span className="text-vyr-accent-transition text-xs font-medium tracking-wider uppercase">
          Transição disponível
        </span>
      </div>
      
      <p className="text-vyr-text-primary text-sm mb-2">
        O sistema sugere transição para{" "}
        <span className="font-medium">{ACTION_LABELS[transition.targetAction]}</span>.
      </p>
      
      <p className="text-vyr-text-muted text-sm mb-4">
        {transition.reason}
      </p>
      
      <div className="flex gap-2">
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-vyr-text-secondary bg-vyr-bg-primary transition-colors active:bg-vyr-stroke-divider"
          >
            Ver detalhes
          </button>
        )}
        <button
          onClick={() => onActivate(transition.targetAction)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-vyr-accent-action transition-opacity active:opacity-80"
        >
          <Play className="w-4 h-4" fill="currentColor" />
          Iniciar {ACTION_LABELS[transition.targetAction]}
        </button>
      </div>
    </div>
  );
}
