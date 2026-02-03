// VYR Labs - Card de Contexto Fisiológico
// Exibe leitura qualitativa SEM dados brutos
// Cores semânticas: verde (favorável), âmbar (atenção), vermelho (limitante)

import type { PhysiologicalContext, ContextStatus } from "@/lib/vyr-types";

interface ContextCardProps {
  context: PhysiologicalContext;
}

const STATUS_CONFIG: Record<ContextStatus, { dotColor: string; textColor: string }> = {
  favorable: {
    dotColor: "bg-vyr-status-positive",
    textColor: "text-vyr-text-secondary",
  },
  attention: {
    dotColor: "bg-vyr-status-caution",
    textColor: "text-vyr-text-secondary",
  },
  limiting: {
    dotColor: "bg-vyr-status-negative",
    textColor: "text-vyr-text-secondary",
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
            <div key={index} className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
              <span className={`text-sm ${config.textColor}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
