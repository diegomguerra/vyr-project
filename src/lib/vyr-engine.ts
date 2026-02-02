// VYR Labs - Engine de Cálculo
// Algoritmos para derivar pilares e score a partir de biomarcadores
// O usuário NUNCA vê os biomarcadores - apenas os resultados interpretados

import type { 
  WearableData, 
  VYRPillars, 
  ComputedState, 
  MomentAction,
  PillarType 
} from "./vyr-types";

// Utilitário para limitar valores
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Arredonda para 1 casa decimal
function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Calcula o pilar ENERGIA
 * Inputs: RHR, sono, atividade anterior
 */
export function computeEnergia(data: WearableData): number {
  let base = 3; // neutro

  // RHR baixo = mais energia (coração eficiente)
  if (data.rhr < 58) base += 1;
  else if (data.rhr < 62) base += 0.5;
  else if (data.rhr > 70) base -= 1;
  else if (data.rhr > 65) base -= 0.5;

  // Sono suficiente = mais energia
  if (data.sleepDuration >= 7.5) base += 1;
  else if (data.sleepDuration >= 7) base += 0.5;
  else if (data.sleepDuration < 5.5) base -= 1.5;
  else if (data.sleepDuration < 6) base -= 1;
  else if (data.sleepDuration < 6.5) base -= 0.5;

  // Atividade alta ontem = menos energia hoje
  if (data.previousDayActivity === "high") base -= 0.5;
  else if (data.previousDayActivity === "low") base += 0.25;

  // Qualidade do sono influencia energia
  if (data.sleepQuality > 80) base += 0.5;
  else if (data.sleepQuality < 50) base -= 0.5;

  return round1(clamp(base, 1, 5));
}

/**
 * Calcula o pilar CLAREZA
 * Inputs: regularidade, qualidade do sono, despertares
 */
export function computeClareza(data: WearableData): number {
  let base = 3;

  // Sono regular = mais clareza (ritmo circadiano)
  if (Math.abs(data.sleepRegularity) < 15) base += 1;
  else if (Math.abs(data.sleepRegularity) < 25) base += 0.5;
  else if (Math.abs(data.sleepRegularity) > 60) base -= 1.5;
  else if (Math.abs(data.sleepRegularity) > 45) base -= 1;
  else if (Math.abs(data.sleepRegularity) > 30) base -= 0.5;

  // Qualidade alta = mais clareza
  if (data.sleepQuality > 85) base += 1;
  else if (data.sleepQuality > 75) base += 0.5;
  else if (data.sleepQuality < 50) base -= 1;
  else if (data.sleepQuality < 60) base -= 0.5;

  // Muitos despertares = menos clareza (sono fragmentado)
  if (data.awakenings > 6) base -= 1;
  else if (data.awakenings > 4) base -= 0.5;
  else if (data.awakenings <= 1) base += 0.5;

  return round1(clamp(base, 1, 5));
}

/**
 * Calcula o pilar ESTABILIDADE
 * Inputs: HRV, stress score
 */
export function computeEstabilidade(data: WearableData): number {
  let base = 3;

  // HRV alto = mais estabilidade (sistema nervoso equilibrado)
  if (data.hrvIndex > 75) base += 1.5;
  else if (data.hrvIndex > 65) base += 1;
  else if (data.hrvIndex > 55) base += 0.5;
  else if (data.hrvIndex < 35) base -= 1.5;
  else if (data.hrvIndex < 45) base -= 1;
  else if (data.hrvIndex < 50) base -= 0.5;

  // Stress baixo = mais estabilidade
  if (data.stressScore < 25) base += 0.75;
  else if (data.stressScore < 35) base += 0.5;
  else if (data.stressScore > 70) base -= 1;
  else if (data.stressScore > 55) base -= 0.5;

  return round1(clamp(base, 1, 5));
}

/**
 * Calcula o VYR Score final
 * Média ponderada com penalização pelo pilar limitante
 */
export function computeVYRScore(pillars: VYRPillars): number {
  const avg = (pillars.energia + pillars.clareza + pillars.estabilidade) / 3;
  const min = Math.min(pillars.energia, pillars.clareza, pillars.estabilidade);

  // O pilar mais baixo "puxa" o score para baixo
  const weighted = (avg * 0.6) + (min * 0.4);

  // Converte para 0-100
  return Math.round((weighted / 5) * 100);
}

/**
 * Identifica o pilar dominante (mais alto)
 */
export function getDominantPillar(pillars: VYRPillars): PillarType {
  const { energia, clareza, estabilidade } = pillars;
  
  if (clareza >= energia && clareza >= estabilidade) return "clareza";
  if (energia >= clareza && energia >= estabilidade) return "energia";
  return "estabilidade";
}

/**
 * Identifica o pilar limitante (mais baixo)
 */
export function getLimitingPillar(pillars: VYRPillars): PillarType {
  const { energia, clareza, estabilidade } = pillars;
  
  if (energia <= clareza && energia <= estabilidade) return "energia";
  if (clareza <= energia && clareza <= estabilidade) return "clareza";
  return "estabilidade";
}

/**
 * Determina a ação recomendada baseada no estado
 */
export function getRecommendedAction(pillars: VYRPillars, score: number): MomentAction {
  const { energia, clareza, estabilidade } = pillars;

  // Score muito baixo = precisa recuperar
  if (score < 45) return "CLEAR";
  
  // Energia ou estabilidade muito baixas = não forçar
  if (energia <= 2 || estabilidade <= 2) return "CLEAR";
  
  // Estado ótimo = pode ativar
  if (energia >= 4 && clareza >= 4 && estabilidade >= 3) return "BOOT";
  
  // Estado moderado = manter
  if (energia >= 3 && clareza >= 3 && estabilidade >= 2.5) return "HOLD";
  
  // Estado intermediário = manutenção conservadora
  if (score >= 55) return "HOLD";
  
  return "CLEAR";
}

/**
 * Gera o label do estado
 */
export function getStateLabel(score: number, action: MomentAction): string {
  if (score >= 85) return "Janela aberta";
  if (score >= 70) return "Energia estável";
  if (score >= 55) return "Início de ciclo";
  if (score >= 45) return "Sustentação necessária";
  return "Recuperação necessária";
}

/**
 * Gera a razão da ação recomendada
 */
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

/**
 * Computa o estado completo a partir dos dados do wearable
 */
export function computeState(data: WearableData): ComputedState {
  // Calcula pilares
  const pillars: VYRPillars = {
    energia: computeEnergia(data),
    clareza: computeClareza(data),
    estabilidade: computeEstabilidade(data),
  };

  // Calcula score
  const vyrScore = computeVYRScore(pillars);

  // Identifica pilares
  const dominantPillar = getDominantPillar(pillars);
  const limitingPillar = getLimitingPillar(pillars);

  // Determina ação
  const recommendedAction = getRecommendedAction(pillars, vyrScore);
  
  // Label e razão
  const stateLabel = getStateLabel(vyrScore, recommendedAction);
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
