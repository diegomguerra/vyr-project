// VYR Labs - Revisão do Dia

import { ChevronLeft } from "lucide-react";
import type { DailyReview } from "@/lib/vyr-types";

interface DayReviewProps {
  review: DailyReview;
  onBack: () => void;
}

export default function DayReview({ review, onBack }: DayReviewProps) {
  return (
    <div className="min-h-screen bg-vyr-bg-primary px-6 py-4 flex flex-col">
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

      {/* Narrativa */}
      <div className="flex-1 flex flex-col justify-center px-4">
        <div className="space-y-6 text-center">
          <p className="text-vyr-text-secondary text-base leading-relaxed">
            {review.narrativeStart}
          </p>
          <p className="text-vyr-text-secondary text-base leading-relaxed">
            {review.narrativeMiddle}
          </p>
          <p className="text-vyr-text-secondary text-base leading-relaxed">
            {review.narrativeEnd}
          </p>
        </div>

        {/* Linha final */}
        <div className="mt-12 pt-8 border-t border-vyr-stroke-divider">
          <p className="text-vyr-text-muted text-sm text-center italic">
            {review.closingLine}
          </p>
        </div>
      </div>
    </div>
  );
}
