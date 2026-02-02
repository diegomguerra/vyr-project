// VYR Labs - Labs (Nível 2 - Ambiente técnico)

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, FileText, Bell } from "lucide-react";
import type { Checkpoint, DailyReview } from "@/lib/vyr-types";
import { formatDate, formatTime } from "@/lib/vyr-store";

type LabsTab = "historico" | "checkpoints" | "revisoes" | "sinais";

interface LabsProps {
  historyByDay: { date: string; score: number }[];
  checkpoints: Checkpoint[];
  dailyReviews: DailyReview[];
  onBack: () => void;
  onReviewTap: (review: DailyReview) => void;
}

export default function Labs({
  historyByDay,
  checkpoints,
  dailyReviews,
  onBack,
  onReviewTap,
}: LabsProps) {
  const [activeTab, setActiveTab] = useState<LabsTab>("historico");

  // Config de sinais (mock)
  const [signals, setSignals] = useState({
    foco: true,
    mudanca: true,
    sustentacao: false,
    encerramento: true,
  });

  const tabs: { id: LabsTab; label: string }[] = [
    { id: "historico", label: "Histórico" },
    { id: "checkpoints", label: "Checkpoints" },
    { id: "revisoes", label: "Revisões" },
    { id: "sinais", label: "Sinais" },
  ];

  return (
    <div className="min-h-screen bg-vyr-bg-primary">
      {/* Header */}
      <div className="sticky top-0 bg-vyr-bg-primary border-b border-vyr-stroke-divider px-6 py-4 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full transition-colors active:bg-vyr-bg-surface"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-6 h-6 text-vyr-text-secondary" />
          </button>
          <h1 className="text-vyr-text-primary text-lg font-medium">Labs</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-vyr-bg-surface text-vyr-text-primary"
                  : "text-vyr-text-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {/* Histórico */}
        {activeTab === "historico" && (
          <div className="space-y-2">
            {historyByDay.map((day) => (
              <div
                key={day.date}
                className="flex items-center justify-between px-4 py-4 bg-vyr-bg-surface rounded-xl"
              >
                <span className="text-vyr-text-secondary text-base">
                  {formatDate(day.date)}
                </span>
                <span className="text-vyr-text-primary text-lg font-medium">
                  {day.score}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Checkpoints */}
        {activeTab === "checkpoints" && (
          <div className="space-y-2">
            {checkpoints.length === 0 ? (
              <p className="text-vyr-text-muted text-center py-8">
                Nenhum checkpoint registrado
              </p>
            ) : (
              checkpoints.map((cp) => (
                <div
                  key={cp.id}
                  className="px-4 py-4 bg-vyr-bg-surface rounded-xl"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-vyr-text-muted" />
                    <span className="text-vyr-text-muted text-sm">
                      {formatDate(cp.timestamp)} • {formatTime(cp.timestamp)}
                    </span>
                  </div>
                  {cp.note && (
                    <p className="text-vyr-text-secondary text-base mt-2">
                      {cp.note}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Revisões */}
        {activeTab === "revisoes" && (
          <div className="space-y-2">
            {dailyReviews.length === 0 ? (
              <p className="text-vyr-text-muted text-center py-8">
                Nenhuma revisão registrada
              </p>
            ) : (
              dailyReviews.map((review) => (
                <button
                  key={review.id}
                  onClick={() => onReviewTap(review)}
                  className="w-full flex items-center justify-between px-4 py-4 bg-vyr-bg-surface rounded-xl transition-colors active:bg-vyr-stroke-divider"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-vyr-text-muted" />
                    <span className="text-vyr-text-secondary text-base">
                      {formatDate(review.date)}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-vyr-text-muted" />
                </button>
              ))
            )}
          </div>
        )}

        {/* Sinais do sistema */}
        {activeTab === "sinais" && (
          <div className="space-y-4">
            <p className="text-vyr-text-muted text-sm mb-4">
              Configure quais sinais do sistema deseja receber.
            </p>

            <SignalToggle
              label="Sistema pronto para iniciar foco."
              checked={signals.foco}
              onChange={(v) => setSignals((s) => ({ ...s, foco: v }))}
            />
            <SignalToggle
              label="Mudança de estado detectada."
              checked={signals.mudanca}
              onChange={(v) => setSignals((s) => ({ ...s, mudanca: v }))}
            />
            <SignalToggle
              label="Janela ideal para sustentação disponível."
              checked={signals.sustentacao}
              onChange={(v) => setSignals((s) => ({ ...s, sustentacao: v }))}
            />
            <SignalToggle
              label="Encerramento cognitivo disponível."
              checked={signals.encerramento}
              onChange={(v) => setSignals((s) => ({ ...s, encerramento: v }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Toggle para sinais
function SignalToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-4 bg-vyr-bg-surface rounded-xl">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Bell className="w-5 h-5 text-vyr-text-muted flex-shrink-0" />
        <span className="text-vyr-text-secondary text-sm leading-snug">
          {label}
        </span>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ml-3 ${
          checked ? "bg-vyr-accent-action" : "bg-vyr-stroke-divider"
        }`}
        aria-checked={checked}
        role="switch"
      >
        <span
          className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
