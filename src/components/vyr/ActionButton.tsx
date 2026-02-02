// VYR Labs - Action Button
// Botão principal de ação com ícone e glow

import { Play, Pause, Moon } from "lucide-react";
import type { MomentAction } from "@/lib/vyr-types";

interface ActionButtonProps {
  /** Tipo da ação atual */
  action: MomentAction;
  /** Texto do botão */
  label: string;
  /** Callback ao clicar */
  onTap: () => void;
  /** Desabilitado */
  disabled?: boolean;
}

const ACTION_ICONS: Record<MomentAction, typeof Play> = {
  BOOT: Play,
  HOLD: Pause,
  CLEAR: Moon,
};

const ACTION_COLORS: Record<MomentAction, string> = {
  BOOT: "bg-vyr-accent-action hover:bg-vyr-accent-action/90",
  HOLD: "bg-vyr-accent-transition hover:bg-vyr-accent-transition/90",
  CLEAR: "bg-vyr-pillar-estabilidade hover:bg-vyr-pillar-estabilidade/90",
};

export function ActionButton({ 
  action, 
  label, 
  onTap,
  disabled = false 
}: ActionButtonProps) {
  const Icon = ACTION_ICONS[action];
  const colorClass = ACTION_COLORS[action];

  return (
    <button
      onClick={onTap}
      disabled={disabled}
      className={`
        w-full flex items-center justify-center gap-3
        px-6 py-4 rounded-xl
        text-white font-medium text-base
        transition-all duration-200
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
      <Icon className="w-5 h-5" fill="currentColor" />
      <span>{label}</span>
    </button>
  );
}
