// VYR Labs - Interpreter
// Tradução de biomarcadores para insights legíveis
// O usuário NUNCA vê dados brutos - apenas interpretações

import type {
  WearableData,
  ComputedState,
  PhysiologicalContext,
  ContextItem,
  ContextStatus,
  CognitiveWindow,
  SuggestedTransition,
  SystemReading,
  PillarDescriptions,
  PillarType,
  MomentAction,
  DetectedPattern,
  DayContext,
} from "./vyr-types";
import { getPillarContextStatus } from "./vyr-engine";

// ===== CONTEXTO FISIOLÓGICO (ALINHADO AOS PILARES) =====

const PILLAR_LABELS: Record<PillarType, Record<ContextStatus, string>> = {
  energia: {
    favorable: "Energia preservada",
    attention: "Energia moderada",
    limiting: "Energia reduzida",
  },
  clareza: {
    favorable: "Clareza disponível",
    attention: "Clareza parcial",
    limiting: "Clareza comprometida",
  },
  estabilidade: {
    favorable: "Estabilidade sustentada",
    attention: "Estabilidade parcial",
    limiting: "Estabilidade reduzida",
  },
};

/**
 * Gera contexto fisiológico derivado dos 3 pilares computados.
 * Substitui thresholds fixos de biomarcadores por status alinhados ao estado calculado.
 */
export function generatePhysiologicalContext(
  data: WearableData,
  computedState?: ComputedState
): PhysiologicalContext {
  // Se não tiver computedState, fallback para pilares neutros
  if (!computedState) {
    return {
      items: [
        { label: "Energia moderada", status: "attention" },
        { label: "Clareza parcial", status: "attention" },
        { label: "Estabilidade parcial", status: "attention" },
      ],
    };
  }

  const { pillars } = computedState;
  const pillarKeys: PillarType[] = ["energia", "clareza", "estabilidade"];

  return {
    items: pillarKeys.map((key): ContextItem => {
      const status = getPillarContextStatus(pillars[key]);
      return {
        label: PILLAR_LABELS[key][status],
        status,
      };
    }),
  };
}

// ===== JANELA COGNITIVA =====

/**
 * Determina se há janela cognitiva disponível
 */
export function generateCognitiveWindow(state: ComputedState): CognitiveWindow {
  const { vyrScore, pillars } = state;
  
  // Condições ideais
  if (vyrScore >= 75 && pillars.clareza >= 4 && pillars.estabilidade >= 3.5) {
    return {
      available: true,
      duration: "3-4 horas",
      suggestion: "Considere priorizar tarefas que exigem concentração profunda.",
    };
  }
  
  // Condições boas
  if (vyrScore >= 65 && pillars.clareza >= 3.5 && pillars.estabilidade >= 3) {
    return {
      available: true,
      duration: "2-3 horas",
      suggestion: "Bom momento para tarefas que exigem foco moderado.",
    };
  }
  
  // Janela limitada
  if (vyrScore >= 55 && pillars.clareza >= 3) {
    return {
      available: true,
      duration: "1-2 horas",
      suggestion: "Janela breve disponível. Priorize tarefas mais curtas.",
    };
  }
  
  return {
    available: false,
    duration: "",
    suggestion: "O sistema sugere aguardar condições mais favoráveis.",
  };
}

// ===== TRANSIÇÃO SUGERIDA =====

/**
 * Determina se deve sugerir transição
 */
export function generateSuggestedTransition(
  currentAction: MomentAction,
  state: ComputedState,
  hoursSinceLastAction: number
): SuggestedTransition {
  const { vyrScore, pillars } = state;
  
  // De BOOT para HOLD (após período de ativação)
  if (currentAction === "BOOT" && hoursSinceLastAction >= 3) {
    if (pillars.estabilidade <= 3 || pillars.energia <= 3) {
      return {
        available: true,
        targetAction: "HOLD",
        reason: "Sinais de estabilização detectados. Sustentação pode preservar melhor o estado.",
      };
    }
  }
  
  // De HOLD para CLEAR (fim do dia ou queda)
  if (currentAction === "HOLD" && hoursSinceLastAction >= 4) {
    if (vyrScore < 55 || pillars.energia <= 2.5) {
      return {
        available: true,
        targetAction: "CLEAR",
        reason: "O sistema sugere transição para recuperação.",
      };
    }
  }
  
  // De CLEAR para BOOT (nova janela disponível)
  if (currentAction === "CLEAR" && hoursSinceLastAction >= 6) {
    if (vyrScore >= 65 && pillars.energia >= 3.5) {
      return {
        available: true,
        targetAction: "BOOT",
        reason: "Nova janela de ativação disponível.",
      };
    }
  }
  
  return {
    available: false,
    targetAction: currentAction,
    reason: "",
  };
}

// ===== LEITURA DO SISTEMA =====

const PILLAR_NAMES: Record<PillarType, string> = {
  energia: "energia",
  clareza: "clareza",
  estabilidade: "estabilidade",
};

/**
 * Gera a leitura do sistema para a Home
 */
export function generateSystemReading(
  state: ComputedState,
  data: WearableData
): SystemReading {
  const { pillars, vyrScore, limitingPillar, dominantPillar } = state;
  
  // Why Score
  let whyScore: string;
  if (vyrScore >= 80) {
    whyScore = "O sistema identificou condições favoráveis em todos os pilares.";
  } else if (vyrScore >= 65) {
    whyScore = `${capitalize(PILLAR_NAMES[dominantPillar])} preservada, com ${PILLAR_NAMES[limitingPillar]} moderada.`;
  } else if (vyrScore >= 50) {
    whyScore = `Estado funcional com ${PILLAR_NAMES[limitingPillar]} como principal atenção.`;
  } else {
    whyScore = "O sistema indica sinais de sobrecarga residual.";
  }
  
  // Limiting Factor
  let limitingFactor: string;
  if (pillars[limitingPillar] >= 4) {
    limitingFactor = "Todos os pilares em níveis adequados.";
  } else if (pillars[limitingPillar] >= 3) {
    limitingFactor = `O limitante hoje é a ${PILLAR_NAMES[limitingPillar]} ao longo do tempo.`;
  } else {
    limitingFactor = `${capitalize(PILLAR_NAMES[limitingPillar])} requer atenção prioritária.`;
  }
  
  // Day Risk — usa pilares em vez de biomarcadores brutos
  let dayRisk: string;
  if (pillars.estabilidade < 3) {
    dayRisk = "Pausas estratégicas tendem a preservar melhor o rendimento.";
  } else if (pillars.energia < 3) {
    dayRisk = "Economia de energia mental é indicada.";
  } else if (vyrScore >= 75) {
    dayRisk = "Hoje há espaço para exigência cognitiva elevada.";
  } else {
    dayRisk = "Mantenha ritmo consistente para preservar o estado.";
  }
  
  return { whyScore, limitingFactor, dayRisk };
}

// ===== DESCRIÇÕES DOS PILARES =====

/**
 * Gera descrições interpretativas dos pilares
 */
export function generatePillarDescriptions(state: ComputedState): PillarDescriptions {
  const { pillars } = state;
  
  // Energia
  let energia: string;
  if (pillars.energia >= 4.5) {
    energia = "Energia elevada e disponível para demandas intensas.";
  } else if (pillars.energia >= 3.5) {
    energia = "Energia disponível, porém controlada.";
  } else if (pillars.energia >= 2.5) {
    energia = "Energia moderada. Economia recomendada.";
  } else {
    energia = "Reserva energética baixa. Priorize recuperação.";
  }
  
  // Clareza
  let clareza: string;
  if (pillars.clareza >= 4.5) {
    clareza = "Excelente capacidade de foco e processamento.";
  } else if (pillars.clareza >= 3.5) {
    clareza = "Boa capacidade de foco e processamento.";
  } else if (pillars.clareza >= 2.5) {
    clareza = "Clareza funcional, com variações possíveis.";
  } else {
    clareza = "Clareza comprometida. Tarefas simples indicadas.";
  }
  
  // Estabilidade
  let estabilidade: string;
  if (pillars.estabilidade >= 4.5) {
    estabilidade = "Alta sustentação ao longo do tempo.";
  } else if (pillars.estabilidade >= 3.5) {
    estabilidade = "Boa sustentação com variações controladas.";
  } else if (pillars.estabilidade >= 2.5) {
    estabilidade = "Sustentação moderada. Pausas ajudam.";
  } else {
    estabilidade = "Sustentação limitada. Evite longos períodos de foco.";
  }
  
  return { energia, clareza, estabilidade };
}

// ===== DIAGNÓSTICO DO SISTEMA =====

/**
 * Gera diagnóstico expandido para detalhe do estado
 */
export function generateSystemDiagnosis(
  state: ComputedState,
  data: WearableData
): string {
  const { vyrScore, limitingPillar, recommendedAction } = state;
  
  let diagnosis: string;
  
  if (vyrScore >= 80) {
    diagnosis = "O sistema indica um estado favorável para execução. Há boa capacidade para demandas cognitivas elevadas hoje.";
  } else if (vyrScore >= 65) {
    diagnosis = `O sistema indica um estado funcional para execução. O principal cuidado hoje é monitorar a ${PILLAR_NAMES[limitingPillar]}.`;
  } else if (vyrScore >= 50) {
    diagnosis = `O sistema sugere cautela. A ${PILLAR_NAMES[limitingPillar]} está abaixo do ideal e pode limitar o desempenho.`;
  } else {
    diagnosis = "O sistema indica necessidade de recuperação. Forçar demandas intensas tende a gerar custo desproporcional.";
  }
  
  // Adiciona contexto da ação
  if (recommendedAction === "BOOT") {
    diagnosis += " Ativação cognitiva está disponível.";
  } else if (recommendedAction === "HOLD") {
    diagnosis += " Sustentação estável é a estratégia indicada.";
  } else {
    diagnosis += " Encerramento e recuperação são prioritários.";
  }
  
  return diagnosis;
}

// ===== SIGNIFICADOS DO DIA =====

/**
 * Gera os bullets "Hoje isso significa"
 */
export function generateTodayMeaning(
  state: ComputedState,
  data: WearableData
): string[] {
  const { vyrScore, pillars, limitingPillar } = state;
  const meanings: string[] = [];
  
  // Primeiro bullet: capacidade
  if (vyrScore >= 80) {
    meanings.push("Boa capacidade para trabalho profundo e contínuo");
  } else if (vyrScore >= 65) {
    meanings.push("Capacidade de foco disponível, mas com limite de duração");
  } else if (vyrScore >= 50) {
    meanings.push("Capacidade funcional para tarefas moderadas");
  } else {
    meanings.push("Não é o momento ideal para demandas intensas");
  }
  
  // Segundo bullet: estratégia
  if (pillars.estabilidade < 3.5) {
    meanings.push("Pausas estratégicas preservam melhor o rendimento");
  } else if (pillars.energia < 3.5) {
    meanings.push("Economia de energia mental prolonga a janela útil");
  } else if (vyrScore >= 75) {
    meanings.push("O sistema suporta demandas intensas com menor desgaste");
  } else if (vyrScore >= 55) {
    meanings.push("Melhor desempenho com ritmo constante");
  } else {
    meanings.push("O sistema prioriza restauração sobre performance");
  }
  
  return meanings;
}

// ===== PADRÕES DETECTADOS =====

/**
 * Analisa histórico e detecta padrões
 */
export function detectPatterns(history: DayContext[]): DetectedPattern[] {
  if (history.length < 7) return [];
  
  const patterns: DetectedPattern[] = [];
  
  // Análise de clareza por dia da semana
  const weekdayClarity = analyzeWeekdayPattern(history, "clareza");
  if (weekdayClarity) {
    patterns.push({
      id: "weekday-clarity",
      description: weekdayClarity,
      period: "Últimos 14 dias",
    });
  }
  
  // Análise de impacto da atividade
  const activityImpact = analyzeActivityImpact(history);
  if (activityImpact) {
    patterns.push({
      id: "activity-impact",
      description: activityImpact,
      period: "Últimos 14 dias",
    });
  }
  
  // Análise de correlação sono-clareza
  const sleepCorrelation = analyzeSleepClarityCorrelation(history);
  if (sleepCorrelation) {
    patterns.push({
      id: "sleep-clarity",
      description: sleepCorrelation.description,
      correlation: sleepCorrelation.correlation,
      period: "Últimos 14 dias",
    });
  }
  
  return patterns;
}

function analyzeWeekdayPattern(history: DayContext[], pillar: PillarType): string | null {
  // Simplificação: identifica se há dias com clareza consistentemente maior
  const weekdayScores: Record<number, number[]> = {};
  
  history.forEach((day) => {
    const date = new Date(day.date);
    const weekday = date.getDay();
    if (!weekdayScores[weekday]) weekdayScores[weekday] = [];
    weekdayScores[weekday].push(day.computedState.pillars[pillar]);
  });
  
  const averages = Object.entries(weekdayScores).map(([day, scores]) => ({
    day: parseInt(day),
    avg: scores.reduce((a, b) => a + b, 0) / scores.length,
  }));
  
  const sorted = averages.sort((a, b) => b.avg - a.avg);
  
  if (sorted.length >= 2 && sorted[0].avg - sorted[sorted.length - 1].avg > 0.8) {
    const dayNames = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
    const bestDays = sorted.slice(0, 2).map((d) => dayNames[d.day]);
    return `Clareza tende a ser maior às manhãs de ${bestDays.join(" e ")}.`;
  }
  
  return null;
}

function analyzeActivityImpact(history: DayContext[]): string | null {
  // Verifica impacto de atividade alta no dia seguinte
  let highActivityDays = 0;
  let lowStabilityAfter = 0;
  
  for (let i = 1; i < history.length; i++) {
    if (history[i].wearableData.previousDayActivity === "high") {
      highActivityDays++;
      if (history[i - 1].computedState.pillars.estabilidade < 3) {
        lowStabilityAfter++;
      }
    }
  }
  
  if (highActivityDays >= 3 && lowStabilityAfter / highActivityDays > 0.5) {
    return "Dias após atividade intensa mostram menor estabilidade.";
  }
  
  return null;
}

function analyzeSleepClarityCorrelation(
  history: DayContext[]
): { description: string; correlation: string } | null {
  // Correlação entre regularidade do sono e clareza
  const regularDays = history.filter((d) => Math.abs(d.wearableData.sleepRegularity) < 25);
  const irregularDays = history.filter((d) => Math.abs(d.wearableData.sleepRegularity) >= 25);
  
  if (regularDays.length >= 3 && irregularDays.length >= 3) {
    const regularClarity = regularDays.reduce((sum, d) => sum + d.computedState.pillars.clareza, 0) / regularDays.length;
    const irregularClarity = irregularDays.reduce((sum, d) => sum + d.computedState.pillars.clareza, 0) / irregularDays.length;
    
    if (regularClarity - irregularClarity > 0.6) {
      return {
        description: "Regularidade do sono correlaciona positivamente com clareza.",
        correlation: "positiva",
      };
    }
  }
  
  return null;
}

// ===== HELPERS =====

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
