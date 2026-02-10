// VYR Labs - Personal Baseline
// Normaliza biomarcadores em relação ao histórico pessoal do usuário
// Em vez de thresholds fixos, o sistema compara cada valor ao padrão individual

import type { WearableData } from "./vyr-types";

// ===== TYPES =====

export interface BaselineMetric {
  mean: number;
  std: number;
}

export interface PersonalBaseline {
  rhr: BaselineMetric;
  hrvIndex: BaselineMetric;
  sleepDuration: BaselineMetric;
  sleepQuality: BaselineMetric;
  sleepRegularity: BaselineMetric;
  awakenings: BaselineMetric;
  stressScore: BaselineMetric;
  spo2: BaselineMetric;
  bodyTemperature: BaselineMetric;
  daysUsed: number;
}

// ===== FALLBACK BASELINE =====
// Valores populacionais médios para quando não há histórico suficiente

export const FALLBACK_BASELINE: PersonalBaseline = {
  rhr: { mean: 63, std: 5 },
  hrvIndex: { mean: 55, std: 12 },
  sleepDuration: { mean: 7.0, std: 0.7 },
  sleepQuality: { mean: 70, std: 10 },
  sleepRegularity: { mean: 0, std: 20 },
  awakenings: { mean: 3, std: 1.5 },
  stressScore: { mean: 40, std: 12 },
  spo2: { mean: 97, std: 1.2 },
  bodyTemperature: { mean: 36.8, std: 0.3 },
  daysUsed: 0,
};

const MIN_DAYS_FOR_BASELINE = 3;

// ===== CÁLCULOS =====

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function standardDeviation(values: number[], avg: number): number {
  if (values.length < 2) return 0;
  const squareDiffs = values.map((v) => (v - avg) ** 2);
  return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / (values.length - 1));
}

function computeMetric(values: number[], fallback: BaselineMetric): BaselineMetric {
  if (values.length < MIN_DAYS_FOR_BASELINE) return fallback;
  const m = mean(values);
  let s = standardDeviation(values, m);
  // Impede std zero (dados constantes) usando fallback
  if (s < 0.01) s = fallback.std;
  return { mean: m, std: s };
}

/**
 * Computa o baseline pessoal a partir do histórico de dados do wearable.
 * Usa os últimos `windowDays` dias (default 14).
 * Se houver menos de MIN_DAYS_FOR_BASELINE dias, retorna fallback.
 */
export function computeBaselineFromHistory(
  data: WearableData[],
  windowDays: number = 14
): PersonalBaseline {
  const recent = data.slice(0, windowDays);

  if (recent.length < MIN_DAYS_FOR_BASELINE) {
    return { ...FALLBACK_BASELINE, daysUsed: recent.length };
  }

  return {
    rhr: computeMetric(recent.filter((d) => d.rhr != null).map((d) => d.rhr!), FALLBACK_BASELINE.rhr),
    hrvIndex: computeMetric(recent.filter((d) => d.hrvIndex != null).map((d) => d.hrvIndex!), FALLBACK_BASELINE.hrvIndex),
    sleepDuration: computeMetric(recent.filter((d) => d.sleepDuration != null).map((d) => d.sleepDuration!), FALLBACK_BASELINE.sleepDuration),
    sleepQuality: computeMetric(recent.filter((d) => d.sleepQuality != null).map((d) => d.sleepQuality!), FALLBACK_BASELINE.sleepQuality),
    sleepRegularity: computeMetric(
      recent.filter((d) => d.sleepRegularity != null).map((d) => Math.abs(d.sleepRegularity!)),
      FALLBACK_BASELINE.sleepRegularity
    ),
    awakenings: computeMetric(recent.filter((d) => d.awakenings != null).map((d) => d.awakenings!), FALLBACK_BASELINE.awakenings),
    stressScore: computeMetric(recent.filter((d) => d.stressScore != null).map((d) => d.stressScore!), FALLBACK_BASELINE.stressScore),
    spo2: computeMetric(
      recent.filter((d) => d.spo2 != null).map((d) => d.spo2!),
      FALLBACK_BASELINE.spo2
    ),
    bodyTemperature: computeMetric(
      recent.filter((d) => d.bodyTemperature != null).map((d) => d.bodyTemperature!),
      FALLBACK_BASELINE.bodyTemperature
    ),
    daysUsed: recent.length,
  };
}

/**
 * Normaliza um valor em relação ao baseline pessoal.
 * Retorna um z-score clampado entre -2 e +2.
 * 
 * Interpretação:
 *  -2  = muito abaixo do padrão pessoal
 *  -1  = abaixo
 *   0  = dentro do normal
 *  +1  = acima
 *  +2  = muito acima do padrão pessoal
 */
export function normalizeToBaseline(
  value: number,
  metric: BaselineMetric
): number {
  if (metric.std === 0) return 0;
  const z = (value - metric.mean) / metric.std;
  return Math.max(-2, Math.min(2, z));
}

/**
 * Converte z-score para a escala de pilar (contribuição de -1.5 a +1.5)
 * Usado para ajustar o base de 3.0 nos cálculos dos pilares
 */
export function zToPillarDelta(z: number): number {
  // Mapeamento linear: z=-2 → -1.5, z=-1 → -0.75, z=0 → 0, z=+1 → +0.75, z=+2 → +1.5
  return z * 0.75;
}
