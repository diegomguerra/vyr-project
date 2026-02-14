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

const PHASES: MomentAction[] = ["BOOT", "HOLD", "CLEAR"];

const PHASE_CONFIG: Record<MomentAction, { label: string; desc: string; color: string }> = {
  BOOT: { label: "Boot", desc: "Manhã · Ativação", color: "text-vyr-pillar-energia" },
  HOLD: { label: "Hold", desc: "Dia · Sustentação", color: "text-vyr-accent-action" },
  CLEAR: { label: "Clear", desc: "Noite · Recuperação", color: "text-vyr-pillar-estabilidade" },
};

type PerceptionMode = "geral" | "por_fase";

interface CognitivePerformanceCardProps {
  onSubmit?: (phase: MomentAction | "GERAL", scores: Record<string, number>) => void;
}

function ScaleSlider({ scale, onChange }: { scale: PerceptionScale; onChange: (key: string, val: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-vyr-text-primary text-xs font-bold tracking-wider uppercase">{scale.label}</span>
        <span className="text-vyr-text-primary text-lg font-semibold tabular-nums">{scale.value}</span>
      </div>
      <p className="text-vyr-text-muted text-xs mb-2">{scale.question}</p>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={scale.value}
        onChange={(e) => onChange(scale.key, Number(e.target.value))}
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
  );
}

export function CognitivePerformanceCard({ onSubmit }: CognitivePerformanceCardProps) {
  const [mode, setMode] = useState<PerceptionMode>("geral");
  const [scales, setScales] = useState<PerceptionScale[]>(SCALES.map((s) => ({ ...s })));
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseSaved, setPhaseSaved] = useState<Record<string, boolean>>({});

  const currentPhase = PHASES[phaseIndex];
  const phaseConfig = PHASE_CONFIG[currentPhase];
  const allPhasesDone = PHASES.every((p) => phaseSaved[p]);

  const updateScale = (key: string, value: number) => {
    setScales((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  };

  const resetScales = () => {
    setScales(SCALES.map((s) => ({ ...s })));
  };

  const getScores = () => {
    const scores: Record<string, number> = {};
    scales.forEach((s) => { scores[s.key] = s.value; });
    return scores;
  };

  const handleGeneralSubmit = () => {
    onSubmit?.("GERAL", getScores());
    resetScales();
  };

  const handlePhaseSubmit = () => {
    onSubmit?.(currentPhase, getScores());
    setPhaseSaved((prev) => ({ ...prev, [currentPhase]: true }));
    resetScales();

    // Advance to next incomplete phase
    const nextIndex = PHASES.findIndex((p, i) => i > phaseIndex && !phaseSaved[p]);
    if (nextIndex !== -1) {
      setPhaseIndex(nextIndex);
    } else {
      // Check if there's an earlier incomplete one
      const earlier = PHASES.findIndex((p) => !phaseSaved[p] && p !== currentPhase);
      if (earlier !== -1) setPhaseIndex(earlier);
    }
  };

  const handleResetPhases = () => {
    setPhaseSaved({});
    setPhaseIndex(0);
    resetScales();
  };

  return (
    <div className="bg-vyr-bg-surface rounded-2xl p-5 border border-vyr-stroke-divider/40">
      <h3 className="text-vyr-text-primary text-sm font-semibold tracking-wider uppercase mb-3">
        Performance Cognitiva
      </h3>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("geral")}
          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
            mode === "geral"
              ? "bg-vyr-accent-action text-white"
              : "bg-vyr-bg-primary text-vyr-text-muted"
          }`}
        >
          Geral do dia
        </button>
        <button
          onClick={() => setMode("por_fase")}
          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
            mode === "por_fase"
              ? "bg-vyr-accent-action text-white"
              : "bg-vyr-bg-primary text-vyr-text-muted"
          }`}
        >
          Por fase
        </button>
      </div>

      {/* Phase indicator (por_fase mode) */}
      {mode === "por_fase" && (
        <div className="mb-4">
          {allPhasesDone ? (
            <div className="text-center py-3">
              <p className="text-vyr-text-primary text-sm font-medium mb-2">✓ Todas as fases registradas</p>
              <button
                onClick={handleResetPhases}
                className="text-vyr-accent-action text-xs underline"
              >
                Registrar novamente
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-3">
                {PHASES.map((p, i) => {
                  const cfg = PHASE_CONFIG[p];
                  const saved = phaseSaved[p];
                  const active = i === phaseIndex && !allPhasesDone;
                  return (
                    <button
                      key={p}
                      onClick={() => !saved && setPhaseIndex(i)}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all ${
                        saved
                          ? "bg-vyr-accent-action/20 text-vyr-accent-action line-through opacity-60"
                          : active
                          ? "bg-vyr-bg-primary border border-vyr-accent-action/40 text-vyr-text-primary"
                          : "bg-vyr-bg-primary text-vyr-text-muted"
                      }`}
                      disabled={saved}
                    >
                      {cfg.label} {saved && "✓"}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-semibold tracking-widest uppercase ${phaseConfig.color}`}>
                  {phaseConfig.label}
                </span>
                <span className="text-vyr-text-muted text-xs">— {phaseConfig.desc}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Sliders */}
      {!(mode === "por_fase" && allPhasesDone) && (
        <>
          <div className="space-y-5">
            {scales.map((scale) => (
              <ScaleSlider key={scale.key} scale={scale} onChange={updateScale} />
            ))}
          </div>

          <button
            onClick={mode === "geral" ? handleGeneralSubmit : handlePhaseSubmit}
            className="w-full mt-5 px-4 py-3 rounded-xl bg-vyr-accent-action text-white text-sm font-medium transition-all active:scale-[0.98] active:opacity-90"
          >
            {mode === "geral"
              ? "Registrar percepção geral"
              : `Registrar ${phaseConfig.label}`}
          </button>
        </>
      )}
    </div>
  );
}

// History record type
export interface PerceptionRecord {
  id: string;
  date: string;
  phase: MomentAction | "GERAL";
  scores: Record<string, number>;
  timestamp: Date;
}

// Phase history card
export function PhaseHistoryCard({ records }: { records: PerceptionRecord[] }) {
  if (records.length === 0) return null;

  const byDate = records.reduce<Record<string, PerceptionRecord[]>>((acc, r) => {
    if (!acc[r.date]) acc[r.date] = [];
    acc[r.date].push(r);
    return acc;
  }, {});

  const phaseConfig: Record<string, { label: string; color: string }> = {
    BOOT: { label: "Boot", color: "text-vyr-pillar-energia" },
    HOLD: { label: "Hold", color: "text-vyr-accent-action" },
    CLEAR: { label: "Clear", color: "text-vyr-pillar-estabilidade" },
    GERAL: { label: "Geral", color: "text-vyr-text-secondary" },
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
              const cfg = phaseConfig[rec.phase] || phaseConfig.GERAL;
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
