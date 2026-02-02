// VYR Labs - Confirmação de Sachê
// Modal exibido após ativar BOOT/HOLD/CLEAR

import { Check } from "lucide-react";
import type { MomentAction, SachetConfirmation as SachetConfirmationType } from "@/lib/vyr-types";

interface SachetConfirmationProps {
  confirmation: SachetConfirmationType;
  onAddObservation?: () => void;
  onDismiss: () => void;
}

const ACTION_LABELS: Record<MomentAction, string> = {
  BOOT: "BOOT",
  HOLD: "HOLD",
  CLEAR: "CLEAR",
};

const ACTION_DESCRIPTIONS: Record<MomentAction, string> = {
  BOOT: "início do ciclo",
  HOLD: "sustentação",
  CLEAR: "encerramento",
};

export function SachetConfirmation({ confirmation, onAddObservation, onDismiss }: SachetConfirmationProps) {
  const { action, timestamp, nextReadingIn } = confirmation;
  const timeStr = timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="w-full max-w-md bg-vyr-bg-surface rounded-2xl p-5 pb-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com check */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-vyr-accent-action/20 flex items-center justify-center">
            <Check className="w-5 h-5 text-vyr-accent-action" />
          </div>
          <span className="text-vyr-text-primary text-lg font-medium">
            {ACTION_LABELS[action]} ativado
          </span>
        </div>
        
        {/* Info */}
        <p className="text-vyr-text-secondary text-sm mb-2">
          O sistema registrou o {ACTION_DESCRIPTIONS[action]} às {timeStr}.
        </p>
        
        <p className="text-vyr-text-muted text-sm mb-5">
          Próxima leitura disponível em {nextReadingIn}.
        </p>
        
        {/* Ações */}
        <div className="flex gap-3">
          {onAddObservation && (
            <button
              onClick={onAddObservation}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-vyr-text-secondary bg-vyr-bg-primary border border-vyr-stroke-divider transition-colors active:bg-vyr-stroke-divider"
            >
              Adicionar observação
            </button>
          )}
          <button
            onClick={onDismiss}
            className={`${onAddObservation ? 'flex-1' : 'w-full'} px-4 py-3 rounded-xl text-sm font-medium text-white bg-vyr-accent-action transition-opacity active:opacity-80`}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
