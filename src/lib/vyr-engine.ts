// VYR Labs - Engine de Cálculo v4
// Algoritmos para derivar pilares e score a partir de biomarcadores
// Agora com: baseline pessoal, validação, contexto temporal, labels ricos

import type { 
  WearableData, 
  VYRPillars, 
  ComputedState, 
  MomentAction,
  PillarType,
  StateLevel,
  ContextStatus,
} from "./vyr-types";
import type { PersonalBaseline } from "./vyr-baseline";
import { FALLBACK_BASELINE, normalizeToBaseline, zToPillarDelta } from "./vyr-baseline";

// ===== NORMALIZAÇÃO HRV =====

/**
 * Converte HRV bruto em milissegundos (ex: 44ms do QRing) para índice 0-100.
 * 
 * Escala baseada em literatura:
 *   <20ms  → 0-15  (muito baixo)
 *   20-40  → 15-40 (baixo)
 *   40-60  → 40-60 (normal)
 *   60-100 → 60-80 (bom)
 *   >100   → 80-100 (excelente)
 * 
 * Fórmula: mapeamento logarítmico suavizado
 */
export function normalizeHrvMsToIndex(hrvMs: number): number {
  const clamped = clamp(hrvMs, 5, 200);
  // Log mapping: ln(5)=1.6, ln(50)=3.9, ln(200)=5.3
  const normalized = (Math.log(clamped) - Math.log(5)) / (Math.log(200) - Math.log(5));
  return Math.round(clamp(normalized * 100, 0, 100));
}

/**
 * Prepara WearableData normalizando hrvRawMs → hrvIndex se necessário
 */
export function normalizeWearableInput(data: WearableData): WearableData {
  let hrvIndex = data.hrvIndex;
  
  // Se temos HRV bruto em ms e o index não foi definido ou é zero
  if (data.hrvRawMs != null && data.hrvRawMs > 0 && (!hrvIndex || hrvIndex === 0)) {
    hrvIndex = normalizeHrvMsToIndex(data.hrvRawMs);
  }
  
  return { ...data, hrvIndex };
}

// ===== VALIDAÇÃO =====

/**
 * Sanitiza dados do wearable, clampando valores para ranges fisiologicamente possíveis.
 * Campos undefined permanecem undefined.
 */
export function validateWearableData(data: WearableData): WearableData {
  return {
    ...data,
    rhr: data.rhr != null ? clamp(data.rhr, 35, 120) : undefined,
    hrvIndex: data.hrvIndex != null ? clamp(data.hrvIndex, 0, 100) : undefined,
    sleepDuration: data.sleepDuration != null ? clamp(data.sleepDuration, 0, 14) : undefined,
    sleepQuality: data.sleepQuality != null ? clamp(data.sleepQuality, 0, 100) : undefined,
    sleepRegularity: data.sleepRegularity != null ? clamp(data.sleepRegularity, -120, 120) : undefined,
    awakenings: data.awakenings != null ? clamp(data.awakenings, 0, 30) : undefined,
    stressScore: data.stressScore != null ? clamp(data.stressScore, 0, 100) : undefined,
    spo2: data.spo2 != null ? clamp(data.spo2, 70, 100) : undefined,
    bodyTemperature: data.bodyTemperature != null ? clamp(data.bodyTemperature, 34, 42) : undefined,
  };
}

// ===== UTILITÁRIOS =====

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

// ===== PESOS DINÂMICOS =====

interface WeightedContribution {
  delta: number;
  weight: number;
}

/**
 * Aplica pesos dinâmicos: coleta contribuições disponíveis e redistribui
 * para que o total de peso sempre some ao mesmo valor alvo.
 */
function applyDynamicWeights(contributions: WeightedContribution[], targetTotalWeight: number): number {
  const available = contributions.filter(c => !isNaN(c.delta));
  if (available.length === 0) return 0;
  
  const actualTotal = available.reduce((sum, c) => sum + c.weight, 0);
  const scale = targetTotalWeight / actualTotal;
  
  return available.reduce((sum, c) => sum + c.delta * c.weight * scale, 0);
}

// ===== PILARES COM BASELINE PESSOAL E PESOS DINÂMICOS =====

/**
 * Calcula o pilar ENERGIA usando baseline pessoal.
 * Redistribui pesos automaticamente se biomarcadores estiverem ausentes.
 */
export function computeEnergia(data: WearableData, baseline?: PersonalBaseline): number {
  const bl = baseline ?? FALLBACK_BASELINE;
  let base = 3; // neutro

  const contributions: WeightedContribution[] = [];

  // RHR: abaixo da média = bom (invertido) — peso 1.0
  if (data.rhr != null) {
    const rhrZ = normalizeToBaseline(data.rhr, bl.rhr);
    contributions.push({ delta: zToPillarDelta(-rhrZ), weight: 1.0 });
  }

  // Sono: acima da média = bom — peso 1.0
  if (data.sleepDuration != null) {
    const sleepZ = normalizeToBaseline(data.sleepDuration, bl.sleepDuration);
    contributions.push({ delta: zToPillarDelta(sleepZ), weight: 1.0 });
  }

  // Qualidade do sono — peso 0.5
  if (data.sleepQuality != null) {
    const qualityZ = normalizeToBaseline(data.sleepQuality, bl.sleepQuality);
    contributions.push({ delta: zToPillarDelta(qualityZ), weight: 0.5 });
  }

  // SpO2: abaixo do baseline = menos energia — peso 0.4
  if (data.spo2 != null) {
    const spo2Z = normalizeToBaseline(data.spo2, bl.spo2);
    contributions.push({ delta: zToPillarDelta(spo2Z), weight: 0.4 });
  }

  // Peso alvo = soma dos pesos nominais dos inputs "core" (RHR + sono + qualidade)
  const TARGET_WEIGHT = 2.5;
  base += applyDynamicWeights(contributions, TARGET_WEIGHT);

  // Atividade alta ontem = penalização fixa (não participa da redistribuição)
  if (data.previousDayActivity === "high") base -= 0.5;
  else if (data.previousDayActivity === "low") base += 0.25;

  return round1(clamp(base, 1, 5));
}

/**
 * Calcula o pilar CLAREZA usando baseline pessoal.
 * Redistribui pesos automaticamente se biomarcadores estiverem ausentes.
 */
export function computeClareza(data: WearableData, baseline?: PersonalBaseline): number {
  const bl = baseline ?? FALLBACK_BASELINE;
  let base = 3;

  const contributions: WeightedContribution[] = [];

  // Regularidade: menos variação = melhor (invertido) — peso 1.0
  if (data.sleepRegularity != null) {
    const regZ = normalizeToBaseline(Math.abs(data.sleepRegularity), bl.sleepRegularity);
    contributions.push({ delta: zToPillarDelta(-regZ), weight: 1.0 });
  }

  // Qualidade do sono: mais = melhor — peso 1.0
  if (data.sleepQuality != null) {
    const qualityZ = normalizeToBaseline(data.sleepQuality, bl.sleepQuality);
    contributions.push({ delta: zToPillarDelta(qualityZ), weight: 1.0 });
  }

  // Despertares: menos = melhor (invertido) — peso 0.5
  if (data.awakenings != null) {
    const awakeZ = normalizeToBaseline(data.awakenings, bl.awakenings);
    contributions.push({ delta: zToPillarDelta(-awakeZ), weight: 0.5 });
  }

  const TARGET_WEIGHT = 2.5;
  base += applyDynamicWeights(contributions, TARGET_WEIGHT);

  return round1(clamp(base, 1, 5));
}

/**
 * Calcula o pilar ESTABILIDADE usando baseline pessoal.
 * Redistribui pesos automaticamente se biomarcadores estiverem ausentes.
 */
export function computeEstabilidade(data: WearableData, baseline?: PersonalBaseline): number {
  const bl = baseline ?? FALLBACK_BASELINE;
  let base = 3;

  const contributions: WeightedContribution[] = [];

  // HRV: acima da média = melhor — peso 1.3
  if (data.hrvIndex != null) {
    const hrvZ = normalizeToBaseline(data.hrvIndex, bl.hrvIndex);
    contributions.push({ delta: zToPillarDelta(hrvZ), weight: 1.3 });
  }

  // Stress: abaixo da média = melhor (invertido) — peso 0.7
  if (data.stressScore != null) {
    const stressZ = normalizeToBaseline(data.stressScore, bl.stressScore);
    contributions.push({ delta: zToPillarDelta(-stressZ), weight: 0.7 });
  }

  // Temperatura: desvio = instabilidade — peso 0.3
  if (data.bodyTemperature != null) {
    const tempZ = normalizeToBaseline(data.bodyTemperature, bl.bodyTemperature);
    contributions.push({ delta: -Math.abs(zToPillarDelta(tempZ)), weight: 0.3 });
  }

  const TARGET_WEIGHT = 2.0;
  base += applyDynamicWeights(contributions, TARGET_WEIGHT);

  return round1(clamp(base, 1, 5));
}

// ===== SCORE =====

/**
 * Calcula o VYR Score final.
 * Média ponderada com penalização pelo pilar limitante.
 */
export function computeVYRScore(pillars: VYRPillars): number {
  const avg = (pillars.energia + pillars.clareza + pillars.estabilidade) / 3;
  const min = Math.min(pillars.energia, pillars.clareza, pillars.estabilidade);

  // O pilar mais baixo "puxa" o score para baixo
  const weighted = (avg * 0.6) + (min * 0.4);

  return Math.round((weighted / 5) * 100);
}

// ===== IDENTIFICAÇÃO DE PILARES =====

export function getDominantPillar(pillars: VYRPillars): PillarType {
  const { energia, clareza, estabilidade } = pillars;
  if (clareza >= energia && clareza >= estabilidade) return "clareza";
  if (energia >= clareza && energia >= estabilidade) return "energia";
  return "estabilidade";
}

export function getLimitingPillar(pillars: VYRPillars): PillarType {
  const { energia, clareza, estabilidade } = pillars;
  if (energia <= clareza && energia <= estabilidade) return "energia";
  if (clareza <= energia && clareza <= estabilidade) return "clareza";
  return "estabilidade";
}

// ===== AÇÃO RECOMENDADA COM CONTEXTO TEMPORAL =====

interface ActionContext {
  hourOfDay?: number;          // 0-23
  sachetsTakenToday?: MomentAction[];  // sachês já tomados
}

/**
 * Determina a ação recomendada baseada no estado, hora do dia e histórico de sachês.
 */
export function getRecommendedAction(
  pillars: VYRPillars,
  score: number,
  context?: ActionContext
): MomentAction {
  const hour = context?.hourOfDay ?? new Date().getHours();
  const taken = context?.sachetsTakenToday ?? [];

  const hasTakenBoot = taken.includes("BOOT");
  const hasTakenHold = taken.includes("HOLD");
  const hasTakenClear = taken.includes("CLEAR");

  // === Regra temporal absoluta: noite = sempre CLEAR ===
  if (hour >= 22 || hour < 5) {
    return "CLEAR";
  }

  // === Score muito baixo = recuperação independente do horário ===
  const energia = pillars.energia;
  const estabilidade = pillars.estabilidade;
  if (score < 45 || energia <= 2 || estabilidade <= 2) {
    return "CLEAR";
  }

  // === Sequência natural do ciclo: BOOT → HOLD → CLEAR ===

  // Janela da manhã (05h-11h): BOOT se disponível
  if (hour >= 5 && hour < 11) {
    if (!hasTakenBoot && pillars.energia >= 3.5 && pillars.clareza >= 3.5 && pillars.estabilidade >= 3) {
      return "BOOT";
    }
    if (!hasTakenBoot && score >= 65) {
      return "BOOT";
    }
    // Já tomou BOOT → sugere HOLD
    if (hasTakenBoot && !hasTakenHold) {
      return "HOLD";
    }
  }

  // Janela do meio-dia/tarde (11h-17h): HOLD preferido
  if (hour >= 11 && hour < 17) {
    if (!hasTakenHold && score >= 55) {
      return "HOLD";
    }
    // Já tomou HOLD → CLEAR
    if (hasTakenHold && !hasTakenClear) {
      return "CLEAR";
    }
    // Não tomou nada → HOLD se estado razoável
    if (!hasTakenBoot && score >= 60) {
      return "HOLD";
    }
  }

  // Janela da noite (17h-22h): CLEAR preferido
  if (hour >= 17 && hour < 22) {
    return "CLEAR";
  }

  // Fallback baseado no estado
  if (score >= 65 && !hasTakenBoot) return "BOOT";
  if (score >= 55 && !hasTakenHold) return "HOLD";
  return "CLEAR";
}

// ===== NÍVEIS OFICIAIS DO VYR STATE =====

export interface StateLevelInfo {
  level: StateLevel;
  label: string;
}

/**
 * Retorna o nível oficial do VYR State baseado no score.
 * Tabela de referência única para todo o sistema.
 */
export function getStateLevel(score: number): StateLevelInfo {
  if (score >= 85) return { level: "optimal", label: "Ótimo" };
  if (score >= 70) return { level: "good", label: "Bom" };
  if (score >= 55) return { level: "moderate", label: "Moderado" };
  if (score >= 40) return { level: "low", label: "Baixo" };
  return { level: "critical", label: "Crítico" };
}

/**
 * Mapeia valor de pilar (0-5) para ContextStatus qualitativo.
 */
export function getPillarContextStatus(pillarValue: number): ContextStatus {
  if (pillarValue >= 4.0) return "favorable";
  if (pillarValue >= 3.0) return "attention";
  return "limiting";
}

// ===== LABELS RICOS =====

/**
 * Gera o label do estado considerando score E composição dos pilares.
 */
export function getStateLabel(
  score: number,
  pillars: VYRPillars,
  dominantPillar: PillarType
): string {
  // Score alto → labels de alta performance
  if (score >= 85) {
    if (dominantPillar === "clareza") return "Foco sustentado";
    if (dominantPillar === "energia") return "Energia plena";
    return "Equilíbrio elevado";
  }

  if (score >= 70) {
    if (dominantPillar === "clareza") return "Clareza disponível";
    if (dominantPillar === "energia") return "Energia estável";
    return "Sustentação adequada";
  }

  if (score >= 55) {
    // Labels de atenção baseados no pilar mais fraco
    const limiting = getLimitingPillar(pillars);
    if (limiting === "estabilidade") return "Foco instável";
    if (limiting === "energia") return "Energia moderada";
    if (limiting === "clareza") return "Clareza parcial";
    return "Início de ciclo";
  }

  if (score >= 45) {
    const limiting = getLimitingPillar(pillars);
    if (limiting === "energia") return "Reserva baixa";
    if (limiting === "estabilidade") return "Oscilação detectada";
    return "Sustentação necessária";
  }

  // Score muito baixo
  if (pillars.energia <= 2) return "Esgotamento energético";
  if (pillars.estabilidade <= 2) return "Instabilidade elevada";
  return "Recuperação necessária";
}

// ===== RAZÃO DA AÇÃO =====

export function getActionReason(
  pillars: VYRPillars, 
  score: number, 
  action: MomentAction,
  limitingPillar: PillarType
): string {
  if (action === "BOOT") {
    if (score >= 85) return "Sistema em condições ideais para ativação completa.";
    return "Sistema pronto para ativação cognitiva.";
  }
  
  if (action === "HOLD") {
    if (limitingPillar === "energia") {
      return "Manutenção conservadora sugerida. Energia moderada.";
    }
    if (limitingPillar === "estabilidade") {
      return "Janela de sustentação favorável. Evite picos de demanda.";
    }
    return "Sustentação estável disponível.";
  }
  
  // CLEAR
  if (score < 45) {
    return "Recuperação tende a ser mais eficaz que exigência hoje.";
  }
  return "Encerramento cognitivo disponível.";
}

// ===== COMPUTAÇÃO COMPLETA =====

/**
 * Computa o estado completo a partir dos dados do wearable.
 * Aceita baseline pessoal e contexto temporal opcionais.
 */
export function computeState(
  data: WearableData,
  baseline?: PersonalBaseline,
  actionContext?: ActionContext
): ComputedState {
  // Normaliza HRV ms → index se necessário, depois valida
  const normalizedData = normalizeWearableInput(data);
  const validData = validateWearableData(normalizedData);

  // Calcula pilares com baseline pessoal
  const pillars: VYRPillars = {
    energia: computeEnergia(validData, baseline),
    clareza: computeClareza(validData, baseline),
    estabilidade: computeEstabilidade(validData, baseline),
  };

  // Calcula score
  const vyrScore = computeVYRScore(pillars);

  // Identifica pilares
  const dominantPillar = getDominantPillar(pillars);
  const limitingPillar = getLimitingPillar(pillars);

  // Determina ação com contexto temporal
  const recommendedAction = getRecommendedAction(pillars, vyrScore, actionContext);
  
  // Label rico e razão
  const stateLabel = getStateLabel(vyrScore, pillars, dominantPillar);
  const actionReason = getActionReason(pillars, vyrScore, recommendedAction, limitingPillar);

  return {
    pillars,
    vyrScore,
    stateLabel,
    dominantPillar,
    limitingPillar,
    recommendedAction,
    actionReason,
  };
}
