// VYR Labs - Engine de Cálculo v4
// Algoritmos para derivar pilares e score a partir de biomarcadores
// Agora com: baseline pessoal, validação, contexto temporal, labels ricos

import type { 
  WearableData, 
  VYRPillars, 
  ComputedState, 
  MomentAction,
  PillarType 
} from "./vyr-types";
import type { PersonalBaseline } from "./vyr-baseline";
import { FALLBACK_BASELINE, normalizeToBaseline, zToPillarDelta } from "./vyr-baseline";

// ===== VALIDAÇÃO =====

/**
 * Sanitiza dados do wearable, clampando valores para ranges fisiologicamente possíveis.
 * Dados fora de range são silenciosamente corrigidos.
 */
export function validateWearableData(data: WearableData): WearableData {
  return {
    ...data,
    rhr: clamp(data.rhr, 35, 120),
    hrvIndex: clamp(data.hrvIndex, 0, 100),
    sleepDuration: clamp(data.sleepDuration, 0, 14),
    sleepQuality: clamp(data.sleepQuality, 0, 100),
    sleepRegularity: clamp(data.sleepRegularity, -120, 120),
    awakenings: clamp(data.awakenings, 0, 30),
    stressScore: clamp(data.stressScore, 0, 100),
  };
}

// ===== UTILITÁRIOS =====

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

// ===== PILARES COM BASELINE PESSOAL =====

/**
 * Calcula o pilar ENERGIA usando baseline pessoal.
 * Inputs: RHR (inversamente proporcional), sono, atividade anterior, qualidade do sono.
 * 
 * RHR ABAIXO da média pessoal = coração eficiente = mais energia → z negativo = bom
 * Sono ACIMA da média pessoal = mais descanso = mais energia → z positivo = bom
 */
export function computeEnergia(data: WearableData, baseline?: PersonalBaseline): number {
  const bl = baseline ?? FALLBACK_BASELINE;
  let base = 3; // neutro

  // RHR: abaixo da média = bom (invertido)
  const rhrZ = normalizeToBaseline(data.rhr, bl.rhr);
  base += zToPillarDelta(-rhrZ); // inverte: RHR baixo = positivo

  // Sono: acima da média = bom
  const sleepZ = normalizeToBaseline(data.sleepDuration, bl.sleepDuration);
  base += zToPillarDelta(sleepZ);

  // Qualidade do sono
  const qualityZ = normalizeToBaseline(data.sleepQuality, bl.sleepQuality);
  base += zToPillarDelta(qualityZ) * 0.5; // peso menor

  // Atividade alta ontem = penalização fixa (não é relativa)
  if (data.previousDayActivity === "high") base -= 0.5;
  else if (data.previousDayActivity === "low") base += 0.25;

  return round1(clamp(base, 1, 5));
}

/**
 * Calcula o pilar CLAREZA usando baseline pessoal.
 * Inputs: regularidade do sono, qualidade, despertares.
 * 
 * Regularidade ABAIXO da média (menos variação) = bom → z negativo = bom
 * Qualidade ACIMA = bom → z positivo = bom  
 * Despertares ABAIXO = bom → z negativo = bom
 */
export function computeClareza(data: WearableData, baseline?: PersonalBaseline): number {
  const bl = baseline ?? FALLBACK_BASELINE;
  let base = 3;

  // Regularidade: menos variação = melhor (invertido)
  const regZ = normalizeToBaseline(Math.abs(data.sleepRegularity), bl.sleepRegularity);
  base += zToPillarDelta(-regZ); // inverte: menos irregular = positivo

  // Qualidade do sono: mais = melhor
  const qualityZ = normalizeToBaseline(data.sleepQuality, bl.sleepQuality);
  base += zToPillarDelta(qualityZ);

  // Despertares: menos = melhor (invertido)
  const awakeZ = normalizeToBaseline(data.awakenings, bl.awakenings);
  base += zToPillarDelta(-awakeZ) * 0.5; // inverte, peso menor

  return round1(clamp(base, 1, 5));
}

/**
 * Calcula o pilar ESTABILIDADE usando baseline pessoal.
 * Inputs: HRV, stress.
 * 
 * HRV ACIMA da média = sistema nervoso equilibrado = bom → z positivo = bom
 * Stress ABAIXO da média = bom → z negativo = bom
 */
export function computeEstabilidade(data: WearableData, baseline?: PersonalBaseline): number {
  const bl = baseline ?? FALLBACK_BASELINE;
  let base = 3;

  // HRV: acima da média = melhor
  const hrvZ = normalizeToBaseline(data.hrvIndex, bl.hrvIndex);
  base += zToPillarDelta(hrvZ) * 1.3; // HRV tem peso maior na estabilidade

  // Stress: abaixo da média = melhor (invertido)
  const stressZ = normalizeToBaseline(data.stressScore, bl.stressScore);
  base += zToPillarDelta(-stressZ) * 0.7;

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
  if (score < 45 || pillars.energia <= 2 || pillars.estabilidade <= 2) {
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
  // Valida entrada
  const validData = validateWearableData(data);

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
