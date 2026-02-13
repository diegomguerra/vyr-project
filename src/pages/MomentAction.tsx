// VYR Labs - Tela de Ação (Visual Whoop-inspired)
// Explicação rica + Ícone de status + Botão de ação

import { ChevronLeft, Play } from "lucide-react";
import { ActionButton } from "@/components/vyr";
import type { MomentAction } from "@/lib/vyr-types";
import { ACTION_COPY } from "@/lib/vyr-store";

interface MomentActionProps {
  action: MomentAction;
  onBack: () => void;
  onConfirm: () => void;
}

const ACTION_ICONS: Record<MomentAction, typeof Play> = {
  BOOT: Play,
  HOLD: Play,
  CLEAR: Play,
};

const ACTION_COLORS: Record<MomentAction, string> = {
  BOOT: "text-vyr-accent-action",
  HOLD: "text-vyr-accent-transition",
  CLEAR: "text-vyr-pillar-estabilidade",
};

const ACTION_GRADIENTS: Record<MomentAction, string> = {
  BOOT: "from-vyr-accent-action/20 to-transparent",
  HOLD: "from-vyr-accent-transition/20 to-transparent",
  CLEAR: "from-vyr-pillar-estabilidade/20 to-transparent",
};

export default function MomentActionPage({ action, onBack, onConfirm }: MomentActionProps) {
  const copy = ACTION_COPY[action];
  const Icon = ACTION_ICONS[action];
  const colorClass = ACTION_COLORS[action];
  const gradientClass = ACTION_GRADIENTS[action];

  return (
    <div className="min-h-screen bg-vyr-bg-primary flex flex-col">
      {/* Header com gradiente */}
      <div className={`relative bg-gradient-to-b ${gradientClass} px-5 pt-4 pb-12 safe-area-top`}>
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full transition-colors active:bg-vyr-bg-surface/50"
          aria-label="Voltar"
        >
          <ChevronLeft className="w-6 h-6 text-vyr-text-secondary" />
        </button>
      </div>

      {/* Conteúdo central */}
      <div className="flex-1 px-6 -mt-6">
        {/* Ícone grande */}
        <div className="flex justify-center mb-6">
          <div className={`
            p-6 rounded-full bg-vyr-bg-surface
            border border-vyr-stroke-divider
          `}>
            <Icon className={`w-12 h-12 ${colorClass}`} strokeWidth={1.5} />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-vyr-text-primary text-2xl font-medium text-center mb-2">
          {copy.title}
        </h1>
        
        {/* System text */}
        <p className="text-vyr-text-muted text-sm text-center mb-8">
          {copy.systemText}
        </p>

        {/* Explicação expandida */}
        <div className="bg-vyr-bg-surface rounded-2xl p-5 mb-6">
          <h2 className="text-vyr-text-muted text-xs tracking-wider uppercase mb-3">
            O que vai acontecer
          </h2>
          <p className="text-vyr-text-secondary text-base leading-relaxed mb-4">
            {copy.expandedText}
          </p>
          
          <div className="h-px bg-vyr-stroke-divider mb-4" />
          
          <h2 className="text-vyr-text-muted text-xs tracking-wider uppercase mb-3">
            O que esperar
          </h2>
          <p className="text-vyr-text-secondary text-base leading-relaxed">
            {copy.expectation}
          </p>
        </div>
      </div>

      {/* Botão de ação fixo no bottom */}
      <div className="px-6 pb-28 pt-4 bg-gradient-to-t from-vyr-bg-primary via-vyr-bg-primary to-transparent">
        <ActionButton
          action={action}
          label={copy.buttonText}
          onTap={onConfirm}
        />
      </div>
    </div>
  );
}
