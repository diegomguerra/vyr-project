// VYR Labs - Labs (Memória Inteligente)
// Histórico rico com estado dominante e nota do sistema

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, FileText, Bell } from "lucide-react";
import type { Checkpoint, DailyReview, HistoryDay } from "@/lib/vyr-types";
import { formatDate, formatDateShort, formatTime } from "@/lib/vyr-store";

type LabsTab = "historico" | "checkpoints" | "revisoes" | "sinais";

interface LabsProps {
  historyByDay: HistoryDay[];
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
        {/* Histórico RICO */}
        {activeTab === "historico" && (
          <div className="space-y-3">
            {historyByDay.map((day) => (
              <div
                key={day.date}
                className="bg-vyr-bg-surface rounded-2xl p-4"
              >
                {/* Data e Score */}
                <div className="flex items-start justify-between mb-3">
                  <span className="text-vyr-text-primary text-base font-medium">
                    {formatDate(day.date)}
                  </span>
                  <span className="text-vyr-text-primary text-2xl font-medium">
                    {day.score}
                  </span>
                </div>
                
                {/* Estado dominante */}
                <p className="text-vyr-text-muted text-xs tracking-wider uppercase mb-1">
                  Estado dominante
                </p>
                <p className="text-vyr-text-secondary text-sm mb-3">
                  {day.dominantState}
                </p>
                
                {/* Nota do sistema */}
                <p className="text-vyr-text-muted text-xs tracking-wider uppercase mb-1">
                  Nota do sistema
                </p>
                <p className="text-vyr-text-secondary text-sm">
                  {day.systemNote}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Checkpoints */}
        {activeTab === "checkpoints" && (
          <div className="space-y-3">
            {checkpoints.length === 0 ? (
              <p className="text-vyr-text-muted text-center py-8">
                Nenhum checkpoint registrado
              </p>
            ) : (
              checkpoints.map((cp) => (
                <div
                  key={cp.id}
                  className="px-4 py-4 bg-vyr-bg-surface rounded-2xl"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-vyr-text-muted" />
                    <span className="text-vyr-text-primary text-sm font-medium">
                      {formatDateShort(cp.timestamp)} — {formatTime(cp.timestamp)}
                    </span>
                  </div>
                  {cp.note ? (
                    <p className="text-vyr-text-secondary text-base">
                      {cp.note}
                    </p>
                  ) : (
                    <p className="text-vyr-text-muted text-sm italic">
                      Sem observação
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Revisões */}
        {activeTab === "revisoes" && (
          <div className="space-y-3">
            {dailyReviews.length === 0 ? (
              <p className="text-vyr-text-muted text-center py-8">
                Nenhuma revisão registrada
              </p>
            ) : (
              dailyReviews.map((review) => (
                <button
                  key={review.id}
                  onClick={() => onReviewTap(review)}
                  className="w-full flex items-center justify-between px-4 py-4 bg-vyr-bg-surface rounded-2xl transition-colors active:bg-vyr-stroke-divider"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-vyr-text-muted" />
                    <span className="text-vyr-text-primary text-base font-medium">
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
            <p className="text-vyr-text-secondary text-sm mb-4 leading-relaxed">
              Configure quais sinais do sistema deseja receber.
            </p>

            <SignalToggle
              label="Sistema pronto para iniciar foco."
              description="Notifica quando há janela cognitiva favorável."
              checked={signals.foco}
              onChange={(v) => setSignals((s) => ({ ...s, foco: v }))}
            />
            <SignalToggle
              label="Mudança de estado detectada."
              description="Alerta sobre variações significativas."
              checked={signals.mudanca}
              onChange={(v) => setSignals((s) => ({ ...s, mudanca: v }))}
            />
            <SignalToggle
              label="Janela ideal para sustentação disponível."
              description="Indica momento para ativar HOLD."
              checked={signals.sustentacao}
              onChange={(v) => setSignals((s) => ({ ...s, sustentacao: v }))}
            />
            <SignalToggle
              label="Encerramento cognitivo disponível."
              description="Sugere transição para recuperação."
              checked={signals.encerramento}
              onChange={(v) => setSignals((s) => ({ ...s, encerramento: v }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Toggle para sinais COM descrição
function SignalToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between px-4 py-4 bg-vyr-bg-surface rounded-2xl gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-4 h-4 text-vyr-text-muted flex-shrink-0" />
          <span className="text-vyr-text-primary text-sm font-medium">
            {label}
          </span>
        </div>
        <p className="text-vyr-text-muted text-xs leading-relaxed pl-6">
          {description}
        </p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
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
