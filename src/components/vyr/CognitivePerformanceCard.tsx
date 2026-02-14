import { useState } from "react";
import type { MomentAction } from "@/lib/vyr-types";

interface PerceptionScale {
  key: string;
  label: string;
  question: string;
  value: number;
}

const SCALES: PerceptionScale[] = [
  { key: "foco", label: "FOCO", question: "Como está sua capacidade de concentração?", value: 5 },
  { key: "clareza", label: "CLAREZA", question: "Sua mente está clara ou confusa?", value: 5 },
  { key: "energia", label: "ENERGIA", question: "Qual seu nível de energia física?", value: 5 },
  { key: "estabilidade", label: "ESTABILIDADE", question: "Como está sua estabilidade emocional?", value: 5 },
];

interface CognitivePerformanceCardProps {
  onSubmit?: (phase: MomentAction, scores: Record<string, number>) => void;
  currentPhase: MomentAction;
}

function PhaseLabel({ phase }: { phase: MomentAction }) {
  const config: Record<MomentAction, { label: string; desc: string }> = {
    BOOT: { label: "Boot", desc: "Manhã · Ativação" },
    HOLD: { label: "Hold", desc: "Dia · Sustentação" },
    CLEAR: { label: "Clear", desc: "Noite · Recuperação" },
  };
  const c = config[phase];
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xs font-semibold tracking-widest uppercase text-vyr-accent-action">{c.label}</span>
      <span className="text-vyr-text-muted text-xs">— {c.desc}</span>
    </div>
  );
}

export function CognitivePerformanceCard({ onSubmit, currentPhase }: CognitivePerformanceCardProps) {
  const [scales, setScales] = useState<PerceptionScale[]>(SCALES);

  const updateScale = (key: string, value: number) => {
    setScales((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  };

  const handleSubmit = () => {
    const scores: Record<string, number> = {};
    scales.forEach((s) => { scores[s.key] = s.value; });
    onSubmit?.(currentPhase, scores);
  };

  return (
    <div className="bg-vyr-bg-surface rounded-2xl p-5 border border-vyr-stroke-divider/40">
      <h3 className="text-vyr-text-primary text-sm font-semibold tracking-wider uppercase mb-1">
        Performance Cognitiva
      </h3>
      <PhaseLabel phase={currentPhase} />

      <div className="space-y-5">
        {scales.map((scale) => (
          <div key={scale.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-vyr-text-primary text-xs font-bold tracking-wider uppercase">
                {scale.label}
              </span>
              <span className="text-vyr-text-primary text-lg font-semibold tabular-nums">
                {scale.value}
              </span>
            </div>
            <p className="text-vyr-text-muted text-xs mb-2">{scale.question}</p>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={scale.value}
              onChange={(e) => updateScale(scale.key, Number(e.target.value))}
              className="w-full h-1.5 appearance-none rounded-full bg-vyr-stroke-divider cursor-pointer accent-vyr-accent-action
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-vyr-text-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-vyr-accent-action [&::-webkit-slider-thumb]:shadow-md
                [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-vyr-text-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-vyr-accent-action"
            />
            <div className="flex justify-between mt-1">
              <span className="text-vyr-text-muted text-[10px]">Baixo</span>
              <span className="text-vyr-text-muted text-[10px]">Médio</span>
              <span className="text-vyr-text-muted text-[10px]">Alto</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-5 px-4 py-3 rounded-xl bg-vyr-accent-action text-white text-sm font-medium transition-all active:scale-[0.98] active:opacity-90"
      >
        Registrar percepção
      </button>
    </div>
  );
}

// History record type
export interface PerceptionRecord {
  id: string;
  date: string;
  phase: MomentAction;
  scores: Record<string, number>;
  timestamp: Date;
}

// Phase history card
export function PhaseHistoryCard({ records }: { records: PerceptionRecord[] }) {
  if (records.length === 0) return null;

  // Group by date
  const byDate = records.reduce<Record<string, PerceptionRecord[]>>((acc, r) => {
    const day = r.date;
    if (!acc[day]) acc[day] = [];
    acc[day].push(r);
    return acc;
  }, {});

  const phaseConfig: Record<MomentAction, { label: string; color: string }> = {
    BOOT: { label: "Boot", color: "text-vyr-pillar-energia" },
    HOLD: { label: "Hold", color: "text-vyr-accent-action" },
    CLEAR: { label: "Clear", color: "text-vyr-pillar-estabilidade" },
  };

  const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-3">
      <h3 className="text-vyr-text-primary text-sm font-medium">Histórico de percepções</h3>
      {dates.map((date) => (
        <div key={date} className="bg-vyr-bg-surface rounded-2xl p-4 border border-vyr-stroke-divider/20">
          <p className="text-vyr-text-primary text-xs font-medium mb-3">
            {new Date(date + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" })}
          </p>
          <div className="space-y-2">
            {byDate[date].map((rec) => {
              const cfg = phaseConfig[rec.phase];
              const avg = Object.values(rec.scores).reduce((a, b) => a + b, 0) / Object.values(rec.scores).length;
              return (
                <div key={rec.id} className="flex items-center justify-between py-1.5 border-b border-vyr-stroke-divider/20 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold tracking-widest uppercase ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-vyr-text-muted text-[10px]">
                      {rec.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="text-vyr-text-muted">F:{rec.scores.foco}</span>
                    <span className="text-vyr-text-muted">C:{rec.scores.clareza}</span>
                    <span className="text-vyr-text-muted">E:{rec.scores.energia}</span>
                    <span className="text-vyr-text-muted">Es:{rec.scores.estabilidade}</span>
                    <span className="text-vyr-text-primary font-semibold text-xs">{avg.toFixed(1)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
