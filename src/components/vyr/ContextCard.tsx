// VYR Labs - Card de Contexto Fisiológico
// Exibe leitura qualitativa SEM dados brutos
// Cores semânticas: verde (favorável), âmbar (atenção), vermelho (limitante)

import type { PhysiologicalContext, ContextStatus } from "@/lib/vyr-types";

interface ContextCardProps {
  context: PhysiologicalContext;
}

const STATUS_CONFIG: Record<ContextStatus, { color: string; icon: string }> = {
  favorable: {
    color: "text-vyr-pillar-estabilidade",
    icon: "🟢",
  },
  attention: {
    color: "text-vyr-accent-transition",
    icon: "🟡",
  },
  limiting: {
    color: "text-red-400",
    icon: "🔴",
  },
};

export function ContextCard({ context }: ContextCardProps) {
  return (
    <div className="bg-vyr-bg-surface rounded-2xl p-4">
      <span className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase block mb-3">
        Contexto do dia
      </span>
      
      <div className="space-y-2.5">
        {context.items.map((item, index) => {
          const config = STATUS_CONFIG[item.status];
          return (
            <div key={index} className="flex items-center gap-2.5">
              <span className="text-sm">{config.icon}</span>
              <span className={`text-sm ${config.color}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
