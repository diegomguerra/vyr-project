// VYR Labs - Action Button
// Botão principal de ação com ícone e glow

import type { MomentAction } from "@/lib/vyr-types";

interface ActionButtonProps {
  /** Tipo da ação atual */
  action: MomentAction;
  /** Texto do botão */
  label: string;
  /** Subtexto abaixo do label */
  subtitle?: string;
  /** Callback ao clicar */
  onTap: () => void;
  /** Desabilitado */
  disabled?: boolean;
}

const ACTION_COLORS: Record<MomentAction, string> = {
  BOOT: "bg-vyr-accent-action hover:bg-vyr-accent-action/90",
  HOLD: "bg-vyr-accent-transition hover:bg-vyr-accent-transition/90",
  CLEAR: "bg-vyr-pillar-estabilidade hover:bg-vyr-pillar-estabilidade/90",
};

export function ActionButton({ 
  action, 
  label, 
  subtitle,
  onTap,
  disabled = false 
}: ActionButtonProps) {
  const colorClass = ACTION_COLORS[action];

  return (
    <button
      onClick={onTap}
      disabled={disabled}
      className={`
        w-full flex flex-col items-center justify-center
        px-6 py-4 rounded-xl
        text-white transition-all duration-200
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${colorClass}
      `}
      style={{
        boxShadow: `0 4px 20px -4px ${
          action === "BOOT" ? "hsl(var(--vyr-accent-action) / 0.4)" :
          action === "HOLD" ? "hsl(var(--vyr-accent-transition) / 0.4)" :
          "hsl(var(--vyr-estabilidade) / 0.4)"
        }`,
      }}
    >
      <span className="font-medium text-base">{label}</span>
      {subtitle && (
        <span className="text-white/80 text-xs mt-1">{subtitle}</span>
      )}
    </button>
  );
}
