// VYR Labs - Comparativo vs Ontem
// Mostra a variação do score em relação ao dia anterior

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ScoreDeltaProps {
  /** Score de hoje */
  todayScore: number;
  /** Score de ontem */
  yesterdayScore: number;
  /** Mostrar animação */
  animate?: boolean;
}

export function ScoreDelta({ 
  todayScore, 
  yesterdayScore,
  animate = true 
}: ScoreDeltaProps) {
  const delta = todayScore - yesterdayScore;
  const isPositive = delta > 0;
  const isNegative = delta < 0;
  const isNeutral = delta === 0;

  // Cor baseada na variação
  const colorClass = isPositive 
    ? "text-vyr-pillar-estabilidade" 
    : isNegative 
    ? "text-vyr-accent-transition" 
    : "text-vyr-text-muted";

  const Icon = isPositive 
    ? TrendingUp 
    : isNegative 
    ? TrendingDown 
    : Minus;

  return (
    <div 
      className={`flex items-center gap-1.5 ${animate ? "animate-delta-pulse" : ""}`}
    >
      <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
      <span className={`text-sm ${colorClass}`}>
        {isNeutral ? "=" : isPositive ? `+${delta}` : delta} vs ontem
      </span>
    </div>
  );
}
