// VYR Labs - Mock Data (cleaned)
// Only keeps DEMO_SCENARIOS for tests and toHistoryDay for conversion

import type { WearableData, DayContext, MomentAction } from "./vyr-types";

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
 * Cenários de demonstração (usados nos testes automatizados)
 */
export const DEMO_SCENARIOS = {
  highPerformance: {
    wearableData: {
      date: new Date().toISOString().slice(0, 10),
      rhr: 56, hrvIndex: 0, hrvRawMs: 65, sleepDuration: 7.8, sleepQuality: 88,
      sleepRegularity: -5, awakenings: 1, previousDayActivity: "low" as const, stressScore: 25,
      spo2: 99, bodyTemperature: 36.5,
    },
  },
  recovery: {
    wearableData: {
      date: new Date().toISOString().slice(0, 10),
      rhr: 68, hrvIndex: 0, hrvRawMs: 36, sleepDuration: 5.2, sleepQuality: 55,
      sleepRegularity: 90, awakenings: 6, previousDayActivity: "high" as const, stressScore: 58,
      spo2: 96, bodyTemperature: 37.2,
    },
  },
  qringReal: {
    wearableData: {
      date: "2026-02-09",
      rhr: 74, hrvIndex: 0, hrvRawMs: 44, sleepDuration: 3.88, sleepQuality: 66,
      sleepRegularity: 0, awakenings: 3, previousDayActivity: "low" as const, stressScore: 46,
      spo2: 98, bodyTemperature: 36.5,
    },
  },
  protocolStart: {
    wearableData: {
      date: new Date().toISOString().slice(0, 10),
      rhr: 62, hrvIndex: 0, hrvRawMs: 50, sleepDuration: 6.5, sleepQuality: 72,
      sleepRegularity: 15, awakenings: 3, previousDayActivity: "medium" as const, stressScore: 42,
      spo2: 97, bodyTemperature: 36.8,
    },
  },
};
