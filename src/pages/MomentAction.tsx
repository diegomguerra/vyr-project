// VYR Labs - Ação do Momento (BOOT/HOLD/CLEAR)

import { ChevronLeft, Play } from "lucide-react";
import type { MomentAction } from "@/lib/vyr-types";
import { ACTION_COPY } from "@/lib/vyr-store";

interface MomentActionProps {
  action: MomentAction;
  onBack: () => void;
  onConfirm: () => void;
}

export default function MomentActionPage({ action, onBack, onConfirm }: MomentActionProps) {
  const copy = ACTION_COPY[action];

  return (
    <div className="min-h-screen bg-vyr-bg-primary px-6 py-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-auto">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full transition-colors active:bg-vyr-bg-surface"
          aria-label="Voltar"
        >
          <ChevronLeft className="w-6 h-6 text-vyr-text-secondary" />
        </button>
      </div>

      {/* Conteúdo central */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {/* Título */}
        <h1 className="text-vyr-text-primary text-2xl font-medium mb-4">
          {copy.title}
        </h1>

        {/* Texto do sistema */}
        <p className="text-vyr-text-secondary text-base mb-2">
          {copy.systemText}
        </p>

        {/* Subtexto */}
        <p className="text-vyr-text-muted text-sm mb-16">
          {copy.subText}
        </p>
      </div>

      {/* CTA */}
      <div className="mb-8">
        <button
          onClick={onConfirm}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-vyr-accent-action text-white font-medium text-base transition-all active:scale-[0.98] active:opacity-90"
        >
          <Play className="w-5 h-5" fill="currentColor" />
          <span>{copy.buttonText}</span>
        </button>
      </div>
    </div>
  );
}
