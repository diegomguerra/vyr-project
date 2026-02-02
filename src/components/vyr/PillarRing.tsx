// VYR Labs - Mini Ring para Pilares
// Exibe um pilar individual com anel pequeno

interface PillarRingProps {
  /** Nome do pilar */
  label: string;
  /** Valor de 0-5 */
  value: number;
  /** Tipo do pilar para cor */
  type: "energia" | "clareza" | "estabilidade";
  /** Tamanho do anel */
  size?: number;
}

const PILLAR_COLORS = {
  energia: "hsl(var(--vyr-energia))",
  clareza: "hsl(var(--vyr-clareza))",
  estabilidade: "hsl(var(--vyr-estabilidade))",
};

export function PillarRing({ 
  label, 
  value, 
  type,
  size = 64 
}: PillarRingProps) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // 270° = 75% do círculo
  const arcLength = circumference * 0.75;
  const progress = (value / 5) * arcLength;
  const color = PILLAR_COLORS[type];

  return (
    <div className="flex flex-col items-center gap-2">
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
          
          {/* Progresso */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${progress} ${circumference}`}
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
            className="text-lg font-medium"
            style={{ color, transform: "translateY(-2px)" }}
          >
            {value}
          </span>
        </div>
      </div>
      
      <span className="text-vyr-text-muted text-xs uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
