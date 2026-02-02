// VYR Labs - Home (Tela Átomo)
// Regra: 1 saudação, 1 título, 1 score, 1 qualificador, 1 ação única

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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 py-8">
      {/* Saudação */}
      <p className="text-vyr-text-secondary text-base mb-12">
        {greeting}
      </p>

      {/* Score Block - tappable */}
      <button
        onClick={onScoreTap}
        className="flex flex-col items-center gap-3 mb-6 transition-opacity active:opacity-70"
        aria-label="Ver detalhe do estado"
      >
        {/* Título */}
        <span className="text-vyr-text-muted text-sm font-medium tracking-wider uppercase">
          VYR STATE
        </span>

        {/* Score grande */}
        <span className="text-vyr-text-primary text-[64px] font-medium leading-none">
          {state.vyrStateScore}
        </span>
      </button>

      {/* Qualificador */}
      <p className="text-vyr-text-secondary text-base mb-16">
        {state.stateLabel}
      </p>

      {/* Divider sutil */}
      <div className="w-16 h-px bg-vyr-stroke-divider mb-16" />

      {/* Ação única */}
      <button
        onClick={onActionTap}
        className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-vyr-accent-action text-white font-medium text-base transition-all active:scale-[0.98] active:opacity-90"
      >
        <Play className="w-5 h-5" fill="currentColor" />
        <span>{state.momentActionTitle}</span>
      </button>
    </div>
  );
}
