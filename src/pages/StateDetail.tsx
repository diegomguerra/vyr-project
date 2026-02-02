// VYR Labs - Detalhe de Estado (Visual Whoop-inspired)
// Ring grande + Pilares detalhados + Diagnóstico

import { ChevronLeft } from "lucide-react";
import { StateRing, PillarRing, InsightCard } from "@/components/vyr";
import type { VYRState } from "@/lib/vyr-types";

interface StateDetailProps {
  state: VYRState;
  onBack: () => void;
}

// Componente de pilar expandido com descrição
function PillarDetail({ 
  label, 
  value, 
  type,
  description 
}: { 
  label: string; 
  value: number;
  type: "energia" | "clareza" | "estabilidade";
  description: string;
}) {
  return (
    <div className="flex items-center gap-4 py-4">
      <PillarRing
        label=""
        value={value}
        type={type}
        size={56}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-vyr-text-primary text-base font-medium">
            {label}
          </span>
          <span className="text-vyr-text-muted text-sm">
            {value}/5
          </span>
        </div>
        <p className="text-vyr-text-secondary text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function StateDetail({ state, onBack }: StateDetailProps) {
  return (
    <div className="min-h-screen bg-vyr-bg-primary px-5 py-4 pb-28">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full transition-colors active:bg-vyr-bg-surface"
          aria-label="Voltar"
        >
          <ChevronLeft className="w-6 h-6 text-vyr-text-secondary" />
        </button>
        <h1 className="text-vyr-text-primary text-lg font-medium">
          Estado atual
        </h1>
      </div>

      {/* Ring Central */}
      <div className="flex justify-center mb-8">
        <StateRing
          value={state.vyrStateScore}
          stateLabel={state.stateLabel}
          animate={false}
        />
      </div>

      {/* Pilares Detalhados */}
      <div className="bg-vyr-bg-surface rounded-2xl px-4 mb-6">
        <PillarDetail 
          label="Energia" 
          value={state.pillars.energia} 
          type="energia"
          description={state.pillarDescriptions.energia}
        />
        <div className="h-px bg-vyr-stroke-divider" />
        <PillarDetail 
          label="Clareza" 
          value={state.pillars.clareza} 
          type="clareza"
          description={state.pillarDescriptions.clareza}
        />
        <div className="h-px bg-vyr-stroke-divider" />
        <PillarDetail 
          label="Estabilidade" 
          value={state.pillars.estabilidade} 
          type="estabilidade"
          description={state.pillarDescriptions.estabilidade}
        />
      </div>

      {/* Diagnóstico do Sistema */}
      <InsightCard
        type="positive"
        title="Diagnóstico do sistema"
      >
        {state.systemDiagnosis}
      </InsightCard>

      {/* Contexto adicional */}
      <div className="mt-4 px-1">
        <p className="text-vyr-text-muted text-xs text-center">
          {state.contextInsight}
        </p>
      </div>
    </div>
  );
}
