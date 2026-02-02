// VYR Labs - Home (Rica em Significado)
// 4 Cards obrigatórios: Estado + Leitura + Significado + Ação

import { Play } from "lucide-react";
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
    <div className="min-h-screen bg-vyr-bg-primary px-5 py-6 pb-24">
      {/* Saudação */}
      <p className="text-vyr-text-secondary text-base mb-6">
        {greeting}
      </p>

      {/* CARD 1 - ESTADO GERAL (Âncora) */}
      <button
        onClick={onScoreTap}
        className="w-full bg-vyr-bg-surface rounded-2xl p-5 mb-4 text-left transition-opacity active:opacity-80"
        aria-label="Ver detalhe do estado"
      >
        <span className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase block mb-3">
          VYR STATE
        </span>
        
        <span className="text-vyr-text-primary text-[56px] font-medium leading-none block mb-4">
          {state.vyrStateScore}
        </span>
        
        <span className="text-vyr-text-muted text-sm block mb-1">
          Estado atual:
        </span>
        <span className="text-vyr-text-secondary text-base leading-relaxed block">
          {state.microDescription}
        </span>
      </button>

      {/* CARD 2 - LEITURA DO SISTEMA */}
      <div className="bg-vyr-bg-surface rounded-2xl p-5 mb-4">
        <span className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase block mb-3">
          Leitura do sistema
        </span>
        
        <div className="space-y-2">
          <p className="text-vyr-text-secondary text-base leading-relaxed">
            {state.systemReading.whyScore}
          </p>
          <p className="text-vyr-text-secondary text-base leading-relaxed">
            {state.systemReading.limitingFactor}
          </p>
          <p className="text-vyr-text-secondary text-base leading-relaxed">
            {state.systemReading.dayRisk}
          </p>
        </div>
      </div>

      {/* CARD 3 - HOJE ISSO SIGNIFICA */}
      <div className="bg-vyr-bg-surface rounded-2xl p-5 mb-4">
        <span className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase block mb-3">
          Hoje isso significa
        </span>
        
        <ul className="space-y-2">
          {state.todayMeaning.map((meaning, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-vyr-text-muted mt-1.5">•</span>
              <span className="text-vyr-text-secondary text-base leading-relaxed">
                {meaning}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CARD 4 - AÇÃO */}
      <div className="bg-vyr-bg-surface rounded-2xl p-5">
        <button
          onClick={onActionTap}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-vyr-accent-action text-white font-medium text-base transition-all active:scale-[0.98] active:opacity-90 mb-4"
        >
          <Play className="w-5 h-5" fill="currentColor" />
          <span>{state.momentActionTitle}</span>
        </button>
        
        <p className="text-vyr-text-secondary text-sm leading-relaxed text-center">
          {state.actionConsequence}
        </p>
      </div>
    </div>
  );
}
