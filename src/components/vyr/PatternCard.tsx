// VYR Labs - Card de Padrões Detectados
// Exibe padrões identificados ao longo do tempo na Labs

import { TrendingUp } from "lucide-react";
import type { DetectedPattern } from "@/lib/vyr-types";

interface PatternCardProps {
  patterns: DetectedPattern[];
}

export function PatternCard({ patterns }: PatternCardProps) {
  if (patterns.length === 0) {
    return null;
  }

  // Pegar o período do primeiro padrão (assumindo que todos têm o mesmo)
  const period = patterns[0]?.period || "Últimos 14 dias";

  return (
    <div className="bg-vyr-bg-surface rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-vyr-text-muted" />
          <span className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase">
            Padrões detectados
          </span>
        </div>
        <span className="text-vyr-text-muted text-xs">
          {period}
        </span>
      </div>
      
      <ul className="space-y-3">
        {patterns.map((pattern) => (
          <li key={pattern.id} className="flex items-start gap-2">
            <span className="text-vyr-accent-action mt-1 text-xs">●</span>
            <span className="text-vyr-text-secondary text-sm leading-relaxed">
              {pattern.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
