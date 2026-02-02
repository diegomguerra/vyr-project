// VYR Labs - Detalhe de Estado (Nível 1)

import { ChevronLeft } from "lucide-react";
import type { VYRState } from "@/lib/vyr-types";

interface StateDetailProps {
  state: VYRState;
  onBack: () => void;
}

// Renderiza pilares como pontos (0-5)
function PillarDots({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-vyr-text-secondary text-base">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${
              i <= value ? "bg-vyr-text-primary" : "bg-vyr-stroke-divider"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function StateDetail({ state, onBack }: StateDetailProps) {
  return (
    <div className="min-h-screen bg-vyr-bg-primary px-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full transition-colors active:bg-vyr-bg-surface"
          aria-label="Voltar"
        >
          <ChevronLeft className="w-6 h-6 text-vyr-text-secondary" />
        </button>
        <h1 className="text-vyr-text-primary text-lg font-medium">Estado atual</h1>
      </div>

      {/* Score */}
      <div className="mb-8">
        <p className="text-vyr-text-muted text-sm tracking-wider uppercase mb-2">
          VYR STATE
        </p>
        <p className="text-vyr-text-primary text-5xl font-medium">
          {state.vyrStateScore}
        </p>
      </div>

      {/* Pilares */}
      <div className="bg-vyr-bg-surface rounded-2xl px-5 py-2 mb-8">
        <PillarDots label="Energia" value={state.pillars.energia} />
        <div className="h-px bg-vyr-stroke-divider" />
        <PillarDots label="Clareza" value={state.pillars.clareza} />
        <div className="h-px bg-vyr-stroke-divider" />
        <PillarDots label="Estabilidade" value={state.pillars.estabilidade} />
      </div>

      {/* Insight */}
      <div className="bg-vyr-bg-surface rounded-2xl px-5 py-4">
        <p className="text-vyr-text-secondary text-base leading-relaxed">
          {state.contextInsight}
        </p>
      </div>
    </div>
  );
}
