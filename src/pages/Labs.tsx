// VYR Labs - Labs (Visual Whoop-inspired)
// Memória inteligente com ring gauges, cards visuais, gráfico de evolução e padrões

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, FileText, Bell, TrendingUp, Brain, Zap, Eye, Shield } from "lucide-react";
import type { Checkpoint, DailyReview, HistoryDay, DetectedPattern, MomentAction } from "@/lib/vyr-types";
import { formatDate, formatDateShort, formatTime } from "@/lib/vyr-store";
import { EvolutionChart, PatternCard } from "@/components/vyr";
import { CognitivePerformanceCard, PhaseHistoryCard, type PerceptionRecord } from "@/components/vyr/CognitivePerformanceCard";

type LabsTab = "historico" | "checkpoints" | "revisoes" | "sinais";

interface LabsProps {
  historyByDay: HistoryDay[];
  checkpoints: Checkpoint[];
  dailyReviews: DailyReview[];
  detectedPatterns?: DetectedPattern[];
  onBack: () => void;
  onReviewTap: (review: DailyReview) => void;
}

// Mini score ring para histórico
function MiniScoreRing({ score }: { score: number }) {
  const size = 48;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const progress = (score / 100) * arcLength;
  
  const color = score >= 70 
    ? "hsl(var(--vyr-accent-action))" 
    : score >= 40 
    ? "hsl(var(--vyr-accent-transition))"
    : "hsl(0 84% 60%)";

  return (
    <div className="relative flex-shrink-0">
      <svg width={size} height={size} style={{ transform: "rotate(-225deg)" }}>
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
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color.replace(")", " / 0.4)")})` }}
        />
      </svg>
      <span 
        className="absolute inset-0 flex items-center justify-center text-sm font-medium text-vyr-text-primary"
        style={{ transform: "translateY(-2px)" }}
      >
        {score}
      </span>
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

export default function Labs({
  historyByDay,
  checkpoints,
  dailyReviews,
  detectedPatterns = [],
  onBack,
  onReviewTap,
}: LabsProps) {
  const [activeTab, setActiveTab] = useState<LabsTab>("historico");
  const [showTutorial, setShowTutorial] = useState(true);

  // Determinar fase atual pela hora
  const hour = new Date().getHours();
  const currentPhase: MomentAction = hour >= 5 && hour < 11 ? "BOOT" : hour >= 11 && hour < 17 ? "HOLD" : "CLEAR";

  // Mock perception records
  const [perceptionRecords, setPerceptionRecords] = useState<PerceptionRecord[]>([
    { id: "1", date: new Date().toISOString().slice(0, 10), phase: "BOOT", scores: { foco: 7, clareza: 6, energia: 8, estabilidade: 7 }, timestamp: new Date(new Date().setHours(8, 30)) },
    { id: "2", date: new Date().toISOString().slice(0, 10), phase: "HOLD", scores: { foco: 6, clareza: 7, energia: 5, estabilidade: 6 }, timestamp: new Date(new Date().setHours(14, 0)) },
  ]);

  const handlePerceptionSubmit = (phase: MomentAction, scores: Record<string, number>) => {
    const record: PerceptionRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().slice(0, 10),
      phase,
      scores,
      timestamp: new Date(),
    };
    setPerceptionRecords((prev) => [record, ...prev]);
  };

  // Config de sinais (mock)
  const [signals, setSignals] = useState({
    foco: true,
    mudanca: true,
    sustentacao: false,
    encerramento: true,
  });

  const tabs: { id: LabsTab; label: string }[] = [
    { id: "historico", label: "Histórico" },
    { id: "checkpoints", label: "Percepções" },
    { id: "revisoes", label: "Revisões" },
    { id: "sinais", label: "Sinais" },
  ];

  return (
    <div className="min-h-screen bg-vyr-bg-primary pb-28">
      {/* Header */}
      <div className="sticky top-0 bg-vyr-bg-primary/95 backdrop-blur-sm border-b border-vyr-stroke-divider px-5 py-4 z-10 safe-area-top">
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

        {/* Tabs com estilo de pílula */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-vyr-accent-action text-white"
                  : "bg-vyr-bg-surface text-vyr-text-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        {/* Histórico com Gráfico de Evolução + Padrões + Lista */}
        {activeTab === "historico" && (
          <div className="space-y-4">
            {/* Gráfico de Evolução */}
            {historyByDay.length > 1 && (
              <EvolutionChart history={historyByDay} />
            )}

            {/* Padrões Detectados (NOVO) */}
            {detectedPatterns.length > 0 && (
              <PatternCard patterns={detectedPatterns} />
            )}

            {/* Lista de dias */}
            <div className="space-y-3">
              {historyByDay.map((day, index) => (
                <div
                  key={day.date}
                  className={`bg-vyr-bg-surface rounded-2xl p-4 ${
                    index === 0 ? "border border-vyr-accent-action/20" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <MiniScoreRing score={day.score} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-vyr-text-primary text-base font-medium">
                          {formatDate(day.date)}
                        </span>
                        {index === 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-vyr-accent-action/20 text-vyr-accent-action">
                            Hoje
                          </span>
                        )}
                      </div>
                      
                      <p className="text-vyr-text-secondary text-sm mb-1 capitalize">
                        {day.dominantState}
                      </p>
                      
                      <p className="text-vyr-text-muted text-xs">
                        {day.systemNote}
                      </p>
                    </div>
                    
                    {index > 0 && index < historyByDay.length - 1 && (
                      <TrendingUp 
                        className={`w-4 h-4 flex-shrink-0 ${
                          day.score > historyByDay[index + 1].score 
                            ? "text-vyr-pillar-estabilidade" 
                            : "text-vyr-accent-transition rotate-180"
                        }`}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Percepções */}
        {activeTab === "checkpoints" && (
          <div className="space-y-5">
            {/* Tutorial rápido */}
            {showTutorial && (
              <div className="bg-vyr-bg-surface border border-vyr-accent-action/20 rounded-2xl p-5 relative">
                <button
                  onClick={() => setShowTutorial(false)}
                  className="absolute top-3 right-3 text-vyr-text-muted text-xs hover:text-vyr-text-secondary"
                >
                  Fechar
                </button>
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-vyr-accent-action" />
                  <h3 className="text-vyr-text-primary text-sm font-semibold">Como funciona</h3>
                </div>
                <div className="space-y-3 text-xs text-vyr-text-secondary leading-relaxed">
                  <p>
                    O algoritmo VYR combina <span className="text-vyr-text-primary font-medium">dados biométricos</span> do seu wearable com suas <span className="text-vyr-text-primary font-medium">percepções subjetivas</span> para calcular seu estado cognitivo real.
                  </p>
                  <div className="grid grid-cols-3 gap-2 my-3">
                    <div className="bg-vyr-bg-primary rounded-xl p-3 text-center">
                      <Zap className="w-3.5 h-3.5 text-vyr-pillar-energia mx-auto mb-1" />
                      <p className="text-[10px] font-semibold text-vyr-text-primary">Boot</p>
                      <p className="text-[9px] text-vyr-text-muted">05h–11h</p>
                    </div>
                    <div className="bg-vyr-bg-primary rounded-xl p-3 text-center">
                      <Eye className="w-3.5 h-3.5 text-vyr-accent-action mx-auto mb-1" />
                      <p className="text-[10px] font-semibold text-vyr-text-primary">Hold</p>
                      <p className="text-[9px] text-vyr-text-muted">11h–17h</p>
                    </div>
                    <div className="bg-vyr-bg-primary rounded-xl p-3 text-center">
                      <Shield className="w-3.5 h-3.5 text-vyr-pillar-estabilidade mx-auto mb-1" />
                      <p className="text-[10px] font-semibold text-vyr-text-primary">Clear</p>
                      <p className="text-[9px] text-vyr-text-muted">17h–22h</p>
                    </div>
                  </div>
                  <p>
                    Registre sua percepção em cada fase do dia. Quanto mais registros, mais o sistema aprende seu padrão e melhora as recomendações.
                  </p>
                </div>
              </div>
            )}

            {/* Card de Performance Cognitiva */}
            <CognitivePerformanceCard
              currentPhase={currentPhase}
              onSubmit={handlePerceptionSubmit}
            />

            {/* Histórico por fase/dia */}
            <PhaseHistoryCard records={perceptionRecords} />

            {/* Observações livres existentes */}
            {checkpoints.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-vyr-text-primary text-sm font-medium">Observações livres</h3>
                {checkpoints.map((cp) => (
                  <div key={cp.id} className="px-4 py-3 bg-vyr-bg-surface rounded-2xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3.5 h-3.5 text-vyr-text-muted" />
                      <span className="text-vyr-text-muted text-xs">
                        {formatDateShort(cp.timestamp)} — {formatTime(cp.timestamp)}
                      </span>
                    </div>
                    {cp.note && <p className="text-vyr-text-secondary text-sm">{cp.note}</p>}
                  </div>
                ))}
              </div>
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
