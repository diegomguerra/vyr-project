// VYR Labs - Insight Card
// Card destacado com interpretação do sistema

import { Lightbulb, AlertCircle, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

type InsightType = "insight" | "warning" | "positive";

interface InsightCardProps {
  /** Tipo do insight para definir cor/ícone */
  type?: InsightType;
  /** Título do card */
  title: string;
  /** Subtítulo explicativo */
  subtitle?: string;
  /** Conteúdo principal */
  children: ReactNode;
  /** Linha de detalhe adicional */
  detail?: string;
}

const INSIGHT_STYLES: Record<InsightType, {
  icon: typeof Lightbulb;
  border: string;
  iconColor: string;
  bg: string;
}> = {
  insight: {
    icon: Lightbulb,
    border: "border-vyr-accent-action/30",
    iconColor: "text-vyr-accent-action",
    bg: "bg-vyr-accent-action/5",
  },
  warning: {
    icon: AlertCircle,
    border: "border-vyr-accent-transition/30",
    iconColor: "text-vyr-accent-transition",
    bg: "bg-vyr-accent-transition/5",
  },
  positive: {
    icon: TrendingUp,
    border: "border-vyr-pillar-estabilidade/30",
    iconColor: "text-vyr-pillar-estabilidade",
    bg: "bg-vyr-pillar-estabilidade/5",
  },
};

export function InsightCard({ 
  type = "insight",
  title,
  subtitle,
  children,
  detail
}: InsightCardProps) {
  const style = INSIGHT_STYLES[type];
  const Icon = style.icon;

  return (
    <div className={`
      rounded-2xl border p-4
      ${style.border} ${style.bg}
      transition-all duration-200
    `}>
      <div className="flex items-start gap-3">
        <div className={`
          flex-shrink-0 p-2 rounded-lg
          bg-vyr-bg-surface/50
        `}>
          <Icon className={`w-5 h-5 ${style.iconColor}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-vyr-text-primary text-sm font-medium mb-0.5">
            {title}
          </h3>
          {subtitle && (
            <p className="text-vyr-text-muted/70 text-xs mb-2">
              {subtitle}
            </p>
          )}
          <div className="text-vyr-text-secondary text-sm leading-relaxed">
            {children}
          </div>
          {detail && (
            <p className="text-vyr-text-muted text-xs mt-2">
              {detail}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
