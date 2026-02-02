// VYR Labs - Mini Ring para Pilares
// Exibe um pilar individual com anel pequeno + stagger animation

import { useEffect, useState } from "react";

interface PillarRingProps {
  /** Nome do pilar */
  label: string;
  /** Valor de 0-5 */
  value: number;
  /** Tipo do pilar para cor */
  type: "energia" | "clareza" | "estabilidade";
  /** Tamanho do anel */
  size?: number;
  /** Índice para stagger (0, 1, 2) */
  staggerIndex?: number;
}

const PILLAR_COLORS = {
  energia: "hsl(var(--vyr-energia))",
  clareza: "hsl(var(--vyr-clareza))",
  estabilidade: "hsl(var(--vyr-estabilidade))",
};

const STAGGER_CLASSES = [
  "animate-stagger-1",
  "animate-stagger-2",
  "animate-stagger-3",
];

export function PillarRing({ 
  label, 
  value, 
  type,
  size = 64,
  staggerIndex = 0 
}: PillarRingProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [displayValue, setDisplayValue] = useState(0);

  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // 270° = 75% do círculo
  const arcLength = circumference * 0.75;
  const progress = (value / 5) * arcLength;
  const color = PILLAR_COLORS[type];

  // Animação do valor
  useEffect(() => {
    const delay = 300 + staggerIndex * 100;
    const duration = 800;
    
    const timeout = setTimeout(() => {
      const startTime = Date.now();
      
      const animateValue = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        
        setDisplayValue(Math.round(eased * value));
        
        if (progress < 1) {
          requestAnimationFrame(animateValue);
        } else {
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animateValue);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, staggerIndex]);

  const strokeDashoffset = isAnimating ? arcLength : arcLength - progress;
  const staggerClass = STAGGER_CLASSES[staggerIndex] || STAGGER_CLASSES[0];

  return (
    <div className={`flex flex-col items-center gap-2 ${staggerClass}`}>
      <div className="relative">
        <svg
          width={size}
          height={size}
          style={{ transform: "rotate(-225deg)" }}
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--vyr-ring-track))"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            className="opacity-30"
          />
          
          {/* Progresso com draw animation */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${color.replace(")", " / 0.4)")})`,
            }}
          />
        </svg>
        
        {/* Valor central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="text-lg font-medium tabular-nums"
            style={{ color, transform: "translateY(-2px)" }}
          >
            {displayValue}
          </span>
        </div>
      </div>
      
      <span className="text-vyr-text-muted text-xs uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
