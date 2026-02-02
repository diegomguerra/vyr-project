// VYR Labs - Detalhe de Estado (Com interpretação)
// Pilares + Texto + Diagnóstico do Sistema

import { ChevronLeft } from "lucide-react";
import type { VYRState } from "@/lib/vyr-types";

interface StateDetailProps {
  state: VYRState;
  onBack: () => void;
}

// Renderiza pilares como pontos (0-5) COM texto interpretativo
function PillarWithDescription({ 
  label, 
  value, 
  description 
}: { 
  label: string; 
  value: number;
  description: string;
}) {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-vyr-text-primary text-base font-medium">{label}</span>
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
      <p className="text-vyr-text-secondary text-sm leading-relaxed">
        {description}
      </p>
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

      {/* Score Block */}
      <div className="mb-8">
        <p className="text-vyr-text-muted text-xs tracking-wider uppercase mb-2">
          VYR STATE
        </p>
        <p className="text-vyr-text-primary text-5xl font-medium">
          {state.vyrStateScore}
        </p>
      </div>

      {/* Pilares com interpretação */}
      <div className="bg-vyr-bg-surface rounded-2xl px-5 mb-6">
        <PillarWithDescription 
          label="Energia" 
          value={state.pillars.energia} 
          description={state.pillarDescriptions.energia}
        />
        <div className="h-px bg-vyr-stroke-divider" />
        <PillarWithDescription 
          label="Clareza" 
          value={state.pillars.clareza} 
          description={state.pillarDescriptions.clareza}
        />
        <div className="h-px bg-vyr-stroke-divider" />
        <PillarWithDescription 
          label="Estabilidade" 
          value={state.pillars.estabilidade} 
          description={state.pillarDescriptions.estabilidade}
        />
      </div>

      {/* Diagnóstico do Sistema */}
      <div className="bg-vyr-bg-surface rounded-2xl px-5 py-5">
        <p className="text-vyr-text-muted text-xs tracking-wider uppercase mb-3">
          Diagnóstico do sistema
        </p>
        <p className="text-vyr-text-secondary text-base leading-relaxed">
          {state.systemDiagnosis}
        </p>
      </div>
    </div>
  );
}
