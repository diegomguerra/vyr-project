// VYR Labs - Mock Data
// Simulação de 30 dias realistas de uso com wearable
// Agora com baseline pessoal e contexto temporal

import type { WearableData, DayContext, Checkpoint, MomentAction } from "./vyr-types";
import { computeState } from "./vyr-engine";
import { computeBaselineFromHistory } from "./vyr-baseline";
import {
  generatePhysiologicalContext,
  generateCognitiveWindow,
  generateSuggestedTransition,
} from "./vyr-interpreter";

// Seed para reproducibilidade
function seededRandom(seed: number): () => number {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

/**
 * Gera dados realistas de wearable para um dia
 */
function generateWearableData(
  date: Date,
  dayIndex: number,
  previousActivity: "low" | "medium" | "high",
  random: () => number
): WearableData {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  let baseRhr = 60 + random() * 10;
  let baseSleepDuration = 6.5 + random() * 1.5;
  let baseSleepQuality = 65 + random() * 25;
  let baseRegularity = (random() - 0.5) * 40;
  let baseHrv = 55 + random() * 25;
  let baseStress = 30 + random() * 30;
  let baseAwakenings = Math.floor(2 + random() * 4);

  if (isWeekend) {
    baseRegularity += 30 + random() * 30;
    baseSleepDuration += random() * 1;
    baseStress -= 10;
  }

  if (previousActivity === "high") {
    baseRhr += 5;
    baseHrv -= 10;
    baseStress += 10;
  }

  // Tendência de melhora com protocolo
  if (dayIndex > 7) { baseHrv += 3; baseSleepQuality += 2; }
  if (dayIndex > 14) { baseHrv += 3; baseSleepQuality += 3; baseRegularity *= 0.8; }
  if (dayIndex > 21) { baseHrv += 2; baseSleepQuality += 2; baseRhr -= 2; }

  let activity: "low" | "medium" | "high" = "medium";
  const activityRoll = random();
  if (activityRoll < 0.2) activity = "low";
  else if (activityRoll > 0.7) activity = "high";
  if (isWeekend && activityRoll > 0.5) activity = "high";

  return {
    date: date.toISOString().slice(0, 10),
    rhr: Math.round(Math.max(52, Math.min(78, baseRhr))),
    hrvIndex: Math.round(Math.max(25, Math.min(90, baseHrv))),
    sleepDuration: Math.round(Math.max(4, Math.min(9, baseSleepDuration)) * 10) / 10,
    sleepQuality: Math.round(Math.max(35, Math.min(95, baseSleepQuality))),
    sleepRegularity: Math.round(Math.max(-90, Math.min(90, baseRegularity))),
    awakenings: Math.max(0, Math.min(10, baseAwakenings)),
    previousDayActivity: previousActivity,
    stressScore: Math.round(Math.max(15, Math.min(80, baseStress))),
  };
}

/**
 * Determina sachês usados no dia baseado na ação recomendada
 */
function determineSachetsUsed(action: MomentAction, random: () => number): MomentAction[] {
  if (action === "BOOT") {
    const r = random();
    if (r > 0.3) return ["BOOT", "HOLD", "CLEAR"];
    if (r > 0.1) return ["BOOT", "HOLD"];
    return ["BOOT"];
  }
  if (action === "HOLD") {
    const r = random();
    if (r > 0.4) return ["HOLD", "CLEAR"];
    return ["HOLD"];
  }
  return ["CLEAR"];
}

/**
 * Gera checkpoints mock para um dia
 */
function generateCheckpoints(
  date: Date,
  _sachets: MomentAction[],
  random: () => number
): Checkpoint[] {
  const checkpoints: Checkpoint[] = [];
  
  if (random() > 0.7) {
    const notes = [
      "Manhã com clareza elevada",
      "Foco sustentado até o almoço",
      "Queda de energia à tarde",
      "Boa recuperação após pausa",
      "Dia produtivo",
      "Dificuldade de concentração",
      null,
    ];
    
    checkpoints.push({
      id: `cp-${date.getTime()}-${random()}`,
      timestamp: new Date(date.getTime() + 10 * 60 * 60 * 1000),
      note: notes[Math.floor(random() * notes.length)] || undefined,
    });
  }
  
  return checkpoints;
}

/**
 * Gera hora simulada do dia para cada dia do histórico
 */
function getSimulatedHour(dayIndex: number, random: () => number): number {
  // Dia atual: hora real; dias anteriores: hora aleatória entre 7-10
  if (dayIndex === 0) return new Date().getHours();
  return 7 + Math.floor(random() * 3);
}

/**
 * Gera 30 dias de dados simulados com baseline pessoal
 */
export function generate30DayHistory(startDate: Date = new Date()): DayContext[] {
  const random = seededRandom(42);
  const history: DayContext[] = [];
  
  let previousActivity: "low" | "medium" | "high" = "medium";
  let currentAction: MomentAction = "BOOT";
  
  // === FASE 1: Gera todos os wearable data primeiro ===
  const allWearableData: WearableData[] = [];
  const randomPhase1 = seededRandom(42);
  let prevAct: "low" | "medium" | "high" = "medium";
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - i);
    const wd = generateWearableData(date, i, prevAct, randomPhase1);
    allWearableData.push(wd);
    prevAct = wd.previousDayActivity;
  }

  // === FASE 2: Computa baseline pessoal dos últimos 14 dias ===
  // Usa os dias mais antigos como histórico (inverso cronológico)
  const historicalData = [...allWearableData].reverse();
  const baseline = computeBaselineFromHistory(historicalData);

  // === FASE 3: Gera contextos com baseline ===
  // Reset random para fase de sachets/checkpoints
  const randomPhase2 = seededRandom(99);
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - i);
    const wearableData = allWearableData[i];
    
    // Hora simulada do dia
    const hourOfDay = getSimulatedHour(i, randomPhase2);
    
    // Computa estado com baseline pessoal e contexto temporal
    const computedState = computeState(wearableData, baseline, {
      hourOfDay,
      sachetsTakenToday: [], // Primeiro cálculo sem sachets
    });
    
    const physiologicalContext = generatePhysiologicalContext(wearableData);
    const cognitiveWindow = generateCognitiveWindow(computedState);
    const suggestedTransition = generateSuggestedTransition(currentAction, computedState, 4);
    const sachetsUsed = determineSachetsUsed(computedState.recommendedAction, randomPhase2);
    const checkpoints = generateCheckpoints(date, sachetsUsed, randomPhase2);
    
    history.push({
      date: wearableData.date,
      wearableData,
      computedState,
      physiologicalContext,
      cognitiveWindow,
      suggestedTransition,
      sachetsUsed,
      checkpoints,
    });
    
    previousActivity = wearableData.previousDayActivity;
    currentAction = computedState.recommendedAction;
  }
  
  return history;
}

/**
 * Converte DayContext para HistoryDay (formato simplificado para UI)
 */
export function toHistoryDay(context: DayContext) {
  const { date, computedState } = context;
  const dominantState = computedState.stateLabel.toLowerCase();
  
  let systemNote: string;
  if (computedState.vyrScore >= 80) {
    systemNote = "dia favorável, boa capacidade cognitiva";
  } else if (computedState.vyrScore >= 65) {
    systemNote = "dia consistente, sem quedas abruptas";
  } else if (computedState.vyrScore >= 50) {
    systemNote = "ajustes ao longo do dia";
  } else {
    systemNote = "dia de recuperação necessária";
  }
  
  return { date, score: computedState.vyrScore, dominantState, systemNote };
}

/**
 * Retorna os últimos N dias de histórico
 */
export function getRecentHistory(days: number = 7) {
  const history = generate30DayHistory();
  return history.slice(0, days);
}

/**
 * Retorna o contexto do dia atual
 */
export function getTodayContext(): DayContext {
  const history = generate30DayHistory();
  return history[0];
}

/**
 * Cenários de demonstração
 */
export const DEMO_SCENARIOS = {
  highPerformance: {
    wearableData: {
      date: new Date().toISOString().slice(0, 10),
      rhr: 56, hrvIndex: 75, sleepDuration: 7.8, sleepQuality: 88,
      sleepRegularity: -5, awakenings: 1, previousDayActivity: "low" as const, stressScore: 25,
    },
  },
  recovery: {
    wearableData: {
      date: new Date().toISOString().slice(0, 10),
      rhr: 68, hrvIndex: 42, sleepDuration: 5.2, sleepQuality: 55,
      sleepRegularity: 90, awakenings: 6, previousDayActivity: "high" as const, stressScore: 58,
    },
  },
  protocolStart: {
    wearableData: {
      date: new Date().toISOString().slice(0, 10),
      rhr: 62, hrvIndex: 58, sleepDuration: 6.5, sleepQuality: 72,
      sleepRegularity: 15, awakenings: 3, previousDayActivity: "medium" as const, stressScore: 42,
    },
  },
};
