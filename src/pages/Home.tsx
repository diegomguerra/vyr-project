// VYR Labs - Home (Visual Whoop-inspired)
// Ring central + 3 pilares + Insight + Ação

import { ChevronRight } from "lucide-react";
import { StateRing, PillarRing, InsightCard, ActionButton } from "@/components/vyr";
import type { VYRState } from "@/lib/vyr-types";

interface HomeProps {
  state: VYRState;
  userName?: string;
  greeting: string;
  onScoreTap: () => void;
  onActionTap: () => void;
}

export default function Home({ state, greeting, onScoreTap, onActionTap }: HomeProps) {
  return (
    <div className="min-h-screen bg-vyr-bg-primary px-5 py-6 pb-28">
      {/* Saudação */}
      <p className="text-vyr-text-secondary text-base mb-8">
        {greeting}
      </p>

      {/* RING CENTRAL - VYR STATE */}
      <div className="flex justify-center mb-8">
        <StateRing
          value={state.vyrStateScore}
          stateLabel={state.stateLabel}
          onTap={onScoreTap}
        />
      </div>

      {/* 3 MINI RINGS - PILARES */}
      <div className="flex justify-center gap-8 mb-8">
        <PillarRing
          label="Energia"
          value={state.pillars.energia}
          type="energia"
        />
        <PillarRing
          label="Clareza"
          value={state.pillars.clareza}
          type="clareza"
        />
        <PillarRing
          label="Estabilidade"
          value={state.pillars.estabilidade}
          type="estabilidade"
        />
      </div>

      {/* INSIGHT CARD - Leitura do Sistema */}
      <div className="mb-4">
        <InsightCard
          type="insight"
          title="Leitura do sistema"
          detail={state.systemReading.dayRisk}
        >
          <p>{state.systemReading.whyScore}</p>
          <p className="mt-1 text-vyr-text-muted">
            {state.systemReading.limitingFactor}
          </p>
        </InsightCard>
      </div>

      {/* CARD - Hoje isso significa */}
      <button
        onClick={onScoreTap}
        className="w-full bg-vyr-bg-surface rounded-2xl p-4 mb-4 text-left transition-opacity active:opacity-80"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase">
            Hoje isso significa
          </span>
          <ChevronRight className="w-4 h-4 text-vyr-text-muted" />
        </div>
        
        <ul className="space-y-2">
          {state.todayMeaning.map((meaning, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-vyr-accent-action mt-1.5 text-xs">●</span>
              <span className="text-vyr-text-secondary text-sm leading-relaxed">
                {meaning}
              </span>
            </li>
          ))}
        </ul>
      </button>

      {/* AÇÃO PRINCIPAL */}
      <div className="space-y-3">
        <ActionButton
          action={state.momentAction}
          label={state.momentActionTitle}
          onTap={onActionTap}
        />
        
        <p className="text-vyr-text-muted text-sm leading-relaxed text-center px-4">
          {state.actionConsequence}
        </p>
      </div>
    </div>
  );
}
