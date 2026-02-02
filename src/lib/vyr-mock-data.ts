// VYR Labs - Mock Data
// Simulação de 30 dias realistas de uso com wearable
// Estes dados simulam a integração com pulseira inteligente

import type { WearableData, DayContext, Checkpoint, MomentAction } from "./vyr-types";
import { computeState } from "./vyr-engine";
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
  
  // Base patterns
  let baseRhr = 60 + random() * 10;
  let baseSleepDuration = 6.5 + random() * 1.5;
  let baseSleepQuality = 65 + random() * 25;
  let baseRegularity = (random() - 0.5) * 40;
  let baseHrv = 55 + random() * 25;
  let baseStress = 30 + random() * 30;
  let baseAwakenings = Math.floor(2 + random() * 4);

  // Weekend effects
  if (isWeekend) {
    baseRegularity += 30 + random() * 30; // Mais irregular
    baseSleepDuration += random() * 1; // Dorme um pouco mais
    baseStress -= 10; // Menos stress
  }

  // Post high-activity effects
  if (previousActivity === "high") {
    baseRhr += 5;
    baseHrv -= 10;
    baseStress += 10;
  }

  // Variações ao longo dos 30 dias (tendência de melhora com protocolo)
  if (dayIndex > 7) {
    baseHrv += 3; // HRV melhora levemente
    baseSleepQuality += 2;
  }
  if (dayIndex > 14) {
    baseHrv += 3;
    baseSleepQuality += 3;
    baseRegularity = baseRegularity * 0.8; // Mais regular
  }
  if (dayIndex > 21) {
    baseHrv += 2;
    baseSleepQuality += 2;
    baseRhr -= 2; // Coração mais eficiente
  }

  // Determine activity level for tomorrow
  let activity: "low" | "medium" | "high" = "medium";
  const activityRoll = random();
  if (activityRoll < 0.2) activity = "low";
  else if (activityRoll > 0.7) activity = "high";
  if (isWeekend && activityRoll > 0.5) activity = "high"; // Mais ativo no fim de semana

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
    if (r > 0.3) return ["BOOT", "HOLD", "CLEAR"]; // Ciclo completo
    if (r > 0.1) return ["BOOT", "HOLD"]; // Ciclo parcial
    return ["BOOT"]; // Só ativação
  }
  
  if (action === "HOLD") {
    const r = random();
    if (r > 0.4) return ["HOLD", "CLEAR"];
    return ["HOLD"];
  }
  
  return ["CLEAR"]; // Só recuperação
}

/**
 * Gera checkpoints mock para um dia
 */
function generateCheckpoints(
  date: Date,
  sachets: MomentAction[],
  random: () => number
): Checkpoint[] {
  const checkpoints: Checkpoint[] = [];
  
  // 30% de chance de ter um checkpoint
  if (random() > 0.7) {
    const notes = [
      "Manhã com clareza elevada",
      "Foco sustentado até o almoço",
      "Queda de energia à tarde",
      "Boa recuperação após pausa",
      "Dia produtivo",
      "Dificuldade de concentração",
      null, // Sem nota
    ];
    
    checkpoints.push({
      id: `cp-${date.getTime()}-${random()}`,
      timestamp: new Date(date.getTime() + 10 * 60 * 60 * 1000), // 10h
      note: notes[Math.floor(random() * notes.length)] || undefined,
    });
  }
  
  return checkpoints;
}

/**
 * Gera 30 dias de dados simulados
 */
export function generate30DayHistory(startDate: Date = new Date()): DayContext[] {
  const random = seededRandom(42); // Seed fixo para reproducibilidade
  const history: DayContext[] = [];
  
  let previousActivity: "low" | "medium" | "high" = "medium";
  let currentAction: MomentAction = "BOOT";
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - i);
    
    // Gera dados do wearable
    const wearableData = generateWearableData(date, i, previousActivity, random);
    
    // Computa estado
    const computedState = computeState(wearableData);
    
    // Gera contexto fisiológico
    const physiologicalContext = generatePhysiologicalContext(wearableData);
    
    // Gera janela cognitiva
    const cognitiveWindow = generateCognitiveWindow(computedState);
    
    // Gera transição sugerida (usando 4h como tempo padrão)
    const suggestedTransition = generateSuggestedTransition(currentAction, computedState, 4);
    
    // Determina sachês usados
    const sachetsUsed = determineSachetsUsed(computedState.recommendedAction, random);
    
    // Gera checkpoints
    const checkpoints = generateCheckpoints(date, sachetsUsed, random);
    
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
    
    // Atualiza para próximo dia
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
  
  // Mapeia estado para descrição dominante
  const dominantState = computedState.stateLabel.toLowerCase();
  
  // Gera nota do sistema baseada no score
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
  
  return {
    date,
    score: computedState.vyrScore,
    dominantState,
    systemNote,
  };
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
 * Retorna dados específicos para demonstração
 * Cenários predefinidos para mostrar diferentes estados
 */
export const DEMO_SCENARIOS = {
  // Dia de alta performance (Quinta do plano)
  highPerformance: {
    wearableData: {
      date: new Date().toISOString().slice(0, 10),
      rhr: 56,
      hrvIndex: 75,
      sleepDuration: 7.8,
      sleepQuality: 88,
      sleepRegularity: -5,
      awakenings: 1,
      previousDayActivity: "low" as const,
      stressScore: 25,
    },
  },
  
  // Dia de recuperação (Sábado do plano)
  recovery: {
    wearableData: {
      date: new Date().toISOString().slice(0, 10),
      rhr: 68,
      hrvIndex: 42,
      sleepDuration: 5.2,
      sleepQuality: 55,
      sleepRegularity: 90,
      awakenings: 6,
      previousDayActivity: "high" as const,
      stressScore: 58,
    },
  },
  
  // Início do protocolo (Segunda do plano)
  protocolStart: {
    wearableData: {
      date: new Date().toISOString().slice(0, 10),
      rhr: 62,
      hrvIndex: 58,
      sleepDuration: 6.5,
      sleepQuality: 72,
      sleepRegularity: 15,
      awakenings: 3,
      previousDayActivity: "medium" as const,
      stressScore: 42,
    },
  },
};
