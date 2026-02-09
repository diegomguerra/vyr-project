// VYR Labs - Mock Store (integrado com Engine v4)
// Usa dados simulados de wearable para gerar estado
// Agora com baseline pessoal e contexto temporal

import { useState, useCallback, useMemo } from "react";
import type { 
  VYRState, 
  Checkpoint, 
  DailyReview, 
  ActionLog, 
  MomentAction, 
  HistoryDay,
  DayContext,
  SachetConfirmation,
  DetectedPattern,
  WearableConnection,
  WearableProvider,
} from "./vyr-types";
import { computeState, getRecommendedAction } from "./vyr-engine";
import { computeBaselineFromHistory } from "./vyr-baseline";
import { 
  generateSystemReading, 
  generatePillarDescriptions, 
  generateSystemDiagnosis,
  generateTodayMeaning,
  generatePhysiologicalContext,
  generateCognitiveWindow,
  generateSuggestedTransition,
  detectPatterns,
} from "./vyr-interpreter";
import { generate30DayHistory, toHistoryDay, DEMO_SCENARIOS } from "./vyr-mock-data";

// Estado inicial de conexão com wearable
const initialWearableConnection: WearableConnection = {
  connected: false,
  provider: null,
  lastSync: null,
  syncStatus: "pending",
  baselineDays: 0,
};

// Gera estado VYR completo a partir de dados de wearable
function buildVYRState(context: DayContext, currentAction: MomentAction): VYRState {
  const { computedState, wearableData } = context;
  
  // Gera interpretações
  const systemReading = generateSystemReading(computedState, wearableData);
  const pillarDescriptions = generatePillarDescriptions(computedState);
  const systemDiagnosis = generateSystemDiagnosis(computedState, wearableData);
  const todayMeaning = generateTodayMeaning(computedState, wearableData);
  
  // Mapeia ação para label
  const actionLabels: Record<MomentAction, string> = {
    BOOT: "Iniciar BOOT",
    HOLD: "Ativar HOLD",
    CLEAR: "Iniciar CLEAR",
  };
  
  const actionConsequences: Record<MomentAction, string> = {
    BOOT: "Iniciar ativação cognitiva gradual para as próximas horas.",
    HOLD: "Manter foco estável pelas próximas horas, priorizando economia cognitiva.",
    CLEAR: "Facilitar transição para recuperação, preservando o que foi construído.",
  };

  return {
    vyrStateScore: computedState.vyrScore,
    stateLabel: computedState.stateLabel,
    pillars: computedState.pillars,
    microDescription: `${computedState.stateLabel} com ${computedState.dominantPillar} como ponto forte.`,
    systemReading,
    todayMeaning,
    momentAction: currentAction,
    momentActionTitle: actionLabels[currentAction],
    actionConsequence: actionConsequences[currentAction],
    pillarDescriptions,
    systemDiagnosis,
    // Legado
    contextInsight: systemReading.whyScore,
    momentActionSystemText: computedState.actionReason,
    momentActionSubText: systemReading.limitingFactor,
  };
}

// Reviews mock
const initialReviews: DailyReview[] = [
  {
    id: "rev-1",
    date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    narrativeStart: "Você iniciou o dia com energia moderada e clareza preservada.",
    narrativeMiddle: "O ciclo BOOT foi ativado às 08:45. Transição para HOLD às 14:20 manteve estabilidade.",
    narrativeEnd: "CLEAR ativado às 19:30. O sistema registrou fechamento adequado do ciclo.",
    valueGenerated: "O sistema manteve coerência entre estado e estratégia ao longo do dia. Boa adequação detectada.",
    closingLine: "Ciclo concluído com sucesso.",
  },
  {
    id: "rev-2",
    date: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
    narrativeStart: "Início com clareza elevada e boa reserva energética.",
    narrativeMiddle: "Dia de alta produtividade. O sistema suportou demandas intensas.",
    narrativeEnd: "Encerramento no horário adequado preservou a recuperação.",
    valueGenerated: "Excelente aproveitamento da janela cognitiva disponível.",
    closingLine: "Padrão consistente.",
  },
];

// Textos expandidos por tipo de ação
export const ACTION_COPY: Record<MomentAction, {
  title: string;
  systemText: string;
  expandedText: string;
  expectation: string;
  buttonText: string;
}> = {
  BOOT: {
    title: "Início de ciclo",
    systemText: "Sistema pronto para iniciar foco.",
    expandedText: "O sistema irá iniciar ativação cognitiva gradual, preparando sua capacidade de processamento para as próximas horas.",
    expectation: "Você deve esperar uma sensação de clareza progressiva nos próximos minutos.",
    buttonText: "Entrar em BOOT",
  },
  HOLD: {
    title: "Sustentação",
    systemText: "Janela de sustentação detectada.",
    expandedText: "O sistema irá priorizar estabilidade cognitiva, evitando picos e quedas bruscas de energia.",
    expectation: "Você deve esperar uma sensação de constância ao longo das próximas horas.",
    buttonText: "Ativar HOLD",
  },
  CLEAR: {
    title: "Encerramento",
    systemText: "Encerramento cognitivo disponível.",
    expandedText: "O sistema irá facilitar a transição para um estado de recuperação, reduzindo gradualmente a carga cognitiva.",
    expectation: "Você deve esperar uma sensação de desaceleração suave e preparação para descanso.",
    buttonText: "Iniciar CLEAR",
  },
};

// Hook para gerenciar o store com engine integrada
export function useVYRStore() {
  // Gera histórico de 30 dias (já usa baseline internamente)
  const history = useMemo(() => generate30DayHistory(), []);
  
  // Contexto do dia atual
  const [todayContext] = useState<DayContext>(history[0]);
  
  // Ação atual (pode ser alterada pelo usuário)
  const [currentAction, setCurrentAction] = useState<MomentAction>(
    todayContext.computedState.recommendedAction
  );
  
  // Sachets tomados hoje (para contexto temporal)
  const [sachetsTakenToday, setSachetsTakenToday] = useState<MomentAction[]>([]);
  
  // Checkpoints
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>(todayContext.checkpoints);
  
  // Action logs
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  
  // Confirmação de sachê
  const [sachetConfirmation, setSachetConfirmation] = useState<SachetConfirmation | null>(null);
  
  // Wearable connection state
  const [wearableConnection, setWearableConnection] = useState<WearableConnection>(
    initialWearableConnection
  );
  
  // Estado VYR derivado
  const state = useMemo(() => 
    buildVYRState(todayContext, currentAction),
    [todayContext, currentAction]
  );
  
  // Histórico simplificado para UI
  const historyByDay = useMemo(() => 
    history.slice(0, 7).map(toHistoryDay),
    [history]
  );
  
  // Contexto fisiológico
  const physiologicalContext = useMemo(() => 
    generatePhysiologicalContext(todayContext.wearableData, todayContext.computedState),
    [todayContext]
  );
  
  // Janela cognitiva
  const cognitiveWindow = useMemo(() => 
    generateCognitiveWindow(todayContext.computedState),
    [todayContext]
  );
  
  // Transição sugerida (usa sachets tomados como proxy de tempo)
  const suggestedTransition = useMemo(() => {
    const hoursSince = sachetsTakenToday.length > 0 ? 3 : 0;
    return generateSuggestedTransition(currentAction, todayContext.computedState, hoursSince);
  }, [currentAction, todayContext, sachetsTakenToday]);
  
  // Padrões detectados
  const detectedPatterns = useMemo(() => 
    detectPatterns(history),
    [history]
  );

  const addCheckpoint = useCallback((note?: string) => {
    const newCheckpoint: Checkpoint = {
      id: `cp-${Date.now()}`,
      timestamp: new Date(),
      note,
    };
    setCheckpoints((prev) => [newCheckpoint, ...prev]);
  }, []);

  const logAction = useCallback((action: MomentAction) => {
    const newLog: ActionLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      action,
    };
    setActionLogs((prev) => [newLog, ...prev]);

    // Registra sachê tomado
    setSachetsTakenToday((prev) => [...prev, action]);

    // Mostra confirmação
    setSachetConfirmation({
      action,
      timestamp: new Date(),
      nextReadingIn: action === "BOOT" ? "2-3 horas" : action === "HOLD" ? "3-4 horas" : "amanhã",
    });

    // Próxima ação usa o engine com contexto atualizado
    const updatedSachets = [...sachetsTakenToday, action];
    const nextAction = getRecommendedAction(
      todayContext.computedState.pillars,
      todayContext.computedState.vyrScore,
      { hourOfDay: new Date().getHours(), sachetsTakenToday: updatedSachets }
    );
    
    setCurrentAction(nextAction);
  }, [sachetsTakenToday, todayContext]);

  const dismissConfirmation = useCallback(() => {
    setSachetConfirmation(null);
  }, []);

  const activateTransition = useCallback((action: MomentAction) => {
    logAction(action);
  }, [logAction]);

  // Wearable connection actions
  const connectWearable = useCallback((provider: WearableProvider) => {
    setWearableConnection({
      connected: true,
      provider,
      lastSync: new Date(),
      syncStatus: "synced",
      baselineDays: 7, // Simula baseline completo para demo
    });
  }, []);

  const disconnectWearable = useCallback(() => {
    setWearableConnection(initialWearableConnection);
  }, []);

  const syncWearable = useCallback(() => {
    setWearableConnection(prev => ({
      ...prev,
      lastSync: new Date(),
      syncStatus: "synced",
    }));
  }, []);

  return {
    // Estado principal
    state,
    checkpoints,
    dailyReviews: initialReviews,
    actionLogs,
    historyByDay,
    
    // Novos dados da engine
    physiologicalContext,
    cognitiveWindow,
    suggestedTransition,
    detectedPatterns,
    sachetConfirmation,
    todayContext,
    fullHistory: history,
    
    // Wearable
    wearableConnection,
    
    // Actions
    addCheckpoint,
    logAction,
    dismissConfirmation,
    activateTransition,
    connectWearable,
    disconnectWearable,
    syncWearable,
  };
}

// Função para obter saudação baseada na hora
export function getGreeting(name: string = "Diego"): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Bom dia, ${name}`;
  if (hour < 18) return `Boa tarde, ${name}`;
  return `Boa noite, ${name}`;
}

// Função para formatar data (formato rico)
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });
}

// Função para formatar data curta
export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

// Função para formatar hora
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
