// VYR Labs - Ring Gauge Principal (estilo Whoop)
// Exibe o VYR State com anel de 270° e glow

import { useMemo } from "react";

interface StateRingProps {
  /** Score de 0-100 */
  value: number;
  /** Label do estado atual */
  stateLabel: string;
  /** Animação ao montar */
  animate?: boolean;
  /** Callback ao tocar */
  onTap?: () => void;
}

export function StateRing({ 
  value, 
  stateLabel, 
  animate = true,
  onTap 
}: StateRingProps) {
  // Configuração do anel
  const size = 220;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // 270° = 75% do círculo
  const arcLength = circumference * 0.75;
  const progress = (value / 100) * arcLength;
  
  // Cor baseada no score
  const ringColor = useMemo(() => {
    if (value >= 70) return "hsl(var(--vyr-accent-action))"; // Azul - bom
    if (value >= 40) return "hsl(var(--vyr-accent-transition))"; // Âmbar - atenção
    return "hsl(0 84% 60%)"; // Vermelho - baixo
  }, [value]);

  return (
    <button
      onClick={onTap}
      className="relative flex flex-col items-center justify-center transition-transform active:scale-[0.98]"
      aria-label={`VYR State: ${value}. ${stateLabel}`}
    >
      <svg
        width={size}
        height={size}
        className={animate ? "animate-fade-in" : ""}
        style={{ transform: "rotate(-225deg)" }}
      >
        {/* Track de fundo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--vyr-ring-track))"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          className="opacity-40"
        />
        
        {/* Anel de progresso com glow */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          className={animate ? "transition-all duration-1000 ease-out" : ""}
          style={{
            filter: `drop-shadow(0 0 12px ${ringColor.replace(")", " / 0.5)")})`,
          }}
        />
      </svg>
      
      {/* Conteúdo central */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ transform: "translateY(-8px)" }}
      >
        <span className="text-vyr-text-muted text-xs tracking-widest uppercase mb-1">
          VYR STATE
        </span>
        <span className="text-6xl font-medium text-vyr-text-primary leading-none">
          {value}
        </span>
        <span className="text-vyr-text-secondary text-sm mt-2">
          {stateLabel}
        </span>
      </div>
    </button>
  );
}
