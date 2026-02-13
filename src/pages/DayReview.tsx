// VYR Labs - Revisão do Dia (Com valor gerado)
// Estrutura: Início + Ao longo + Encerramento + Valor + Fechamento

import { ChevronLeft } from "lucide-react";
import type { DailyReview } from "@/lib/vyr-types";

interface DayReviewProps {
  review: DailyReview;
  onBack: () => void;
}

export default function DayReview({ review, onBack }: DayReviewProps) {
  return (
    <div className="min-h-screen bg-vyr-bg-primary px-6 pt-4 pb-4 flex flex-col safe-area-top">
      {/* Header */}
      <div className="flex items-center gap-3 mb-12">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full transition-colors active:bg-vyr-bg-surface"
          aria-label="Voltar"
        >
          <ChevronLeft className="w-6 h-6 text-vyr-text-secondary" />
        </button>
        <h1 className="text-vyr-text-primary text-lg font-medium">
          Encerramento do dia
        </h1>
      </div>

      {/* Narrativa estruturada */}
      <div className="flex-1 px-2">
        {/* Bloco 1 - Início do dia */}
        <div className="mb-8">
          <p className="text-vyr-text-muted text-xs tracking-wider uppercase mb-2">
            Início do dia
          </p>
          <p className="text-vyr-text-secondary text-base leading-relaxed">
            {review.narrativeStart}
          </p>
        </div>

        {/* Bloco 2 - Ao longo do dia */}
        <div className="mb-8">
          <p className="text-vyr-text-muted text-xs tracking-wider uppercase mb-2">
            Ao longo do dia
          </p>
          <p className="text-vyr-text-secondary text-base leading-relaxed">
            {review.narrativeMiddle}
          </p>
        </div>

        {/* Bloco 3 - Encerramento */}
        <div className="mb-10">
          <p className="text-vyr-text-muted text-xs tracking-wider uppercase mb-2">
            Encerramento
          </p>
          <p className="text-vyr-text-secondary text-base leading-relaxed">
            {review.narrativeEnd}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-vyr-stroke-divider mb-10" />

        {/* Valor gerado pelo sistema */}
        <div className="mb-8">
          <p className="text-vyr-text-secondary text-base leading-relaxed">
            {review.valueGenerated}
          </p>
        </div>

        {/* Linha final */}
        <p className="text-vyr-text-muted text-sm italic">
          {review.closingLine}
        </p>
      </div>
    </div>
  );
}
