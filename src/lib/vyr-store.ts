// VYR Labs - Store (real data from DB)
// Queries computed_states, action_logs, checkpoints, daily_reviews from database
// Falls back to empty state when no data is available

import { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { connectAppleHealth, disconnectAppleHealth, syncHealthKitData, getAppleHealthStatus } from "./healthkit-sync";
import { getValidUserId, retryOnAuthError } from "./auth-session";
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
import { getRecommendedAction } from "./vyr-engine";

// Estado inicial de conexão com wearable
const initialWearableConnection: WearableConnection = {
  connected: false,
  provider: null,
  lastSync: null,
  syncStatus: "pending",
  baselineDays: 0,
};

// Estado VYR vazio (sem dados de wearable)
const EMPTY_STATE: VYRState = {
  vyrStateScore: 0,
  stateLabel: "Sem dados",
  pillars: { energia: 0, clareza: 0, estabilidade: 0 },
  microDescription: "Conecte um wearable para iniciar.",
  systemReading: {
    whyScore: "Sem dados disponíveis para análise.",
    limitingFactor: "Nenhum wearable conectado.",
    dayRisk: "Conecte seu dispositivo para receber leituras.",
  },
  todayMeaning: ["Conecte um wearable para ver o que seu dia pode significar."],
  momentAction: "BOOT",
  momentActionTitle: "Aguardando dados",
  actionConsequence: "Conecte um wearable para receber recomendações personalizadas.",
  pillarDescriptions: {
    energia: "Aguardando leitura.",
    clareza: "Aguardando leitura.",
    estabilidade: "Aguardando leitura.",
  },
  systemDiagnosis: "Conecte um wearable para que o VYR possa calcular seu estado cognitivo.",
  contextInsight: "Sem dados disponíveis.",
  momentActionSystemText: "Aguardando dados.",
  momentActionSubText: "Conecte um wearable.",
};

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

// Hook para gerenciar o store com dados reais do banco
export function useVYRStore() {
  const today = new Date().toISOString().slice(0, 10);
  const queryClient = useQueryClient();

  // === QUERIES AO BANCO ===

  // Computed states (últimos 30 dias)
  const { data: dbComputedStates } = useQuery({
    queryKey: ["computed_states"],
    queryFn: async () => {
      const { data } = await supabase
        .from("computed_states")
        .select("*")
        .order("date", { ascending: false })
        .limit(30);
      return data ?? [];
    },
  });

  // Action logs de hoje
  const { data: dbActionLogs } = useQuery({
    queryKey: ["action_logs", today],
    queryFn: async () => {
      const { data } = await supabase
        .from("action_logs")
        .select("*")
        .gte("created_at", `${today}T00:00:00`)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  // Checkpoints de hoje
  const { data: dbCheckpoints } = useQuery({
    queryKey: ["checkpoints", today],
    queryFn: async () => {
      const { data } = await supabase
        .from("checkpoints")
        .select("*")
        .gte("created_at", `${today}T00:00:00`)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  // Daily reviews (últimos 7 dias)
  const { data: dbDailyReviews } = useQuery({
    queryKey: ["daily_reviews"],
    queryFn: async () => {
      const { data } = await supabase
        .from("daily_reviews")
        .select("*")
        .order("date", { ascending: false })
        .limit(7);
      return data ?? [];
    },
  });

  // === ESTADO DERIVADO ===

  const hasData = (dbComputedStates?.length ?? 0) > 0;
  const todayState = dbComputedStates?.[0];

  // Estado VYR (real ou vazio)
  const state: VYRState = useMemo(() => {
    if (!hasData || !todayState) return EMPTY_STATE;

    return {
      vyrStateScore: todayState.vyr_score ?? 0,
      stateLabel: todayState.state_label ?? "Calculando",
      pillars: {
        energia: todayState.energia ?? 0,
        clareza: todayState.clareza ?? 0,
        estabilidade: todayState.estabilidade ?? 0,
      },
      microDescription: `${todayState.state_label ?? "Estado"} com ${todayState.dominant_pillar ?? "equilíbrio"} como ponto forte.`,
      systemReading: {
        whyScore: todayState.action_reason ?? "Leitura calculada a partir dos seus dados biométricos.",
        limitingFactor: todayState.limiting_pillar 
          ? `${todayState.limiting_pillar} é o pilar que mais limita hoje.` 
          : "Sem fator limitante identificado.",
        dayRisk: todayState.vyr_score && todayState.vyr_score < 50 
          ? "Dia de recuperação recomendada." 
          : "Dia dentro da normalidade.",
      },
      todayMeaning: [
        todayState.vyr_score && todayState.vyr_score >= 70
          ? "Bom dia para tarefas que exigem concentração."
          : todayState.vyr_score && todayState.vyr_score >= 50
          ? "Dia adequado para rotina com pausas regulares."
          : "Priorize tarefas leves e recuperação.",
      ],
      momentAction: todayState.recommended_action ?? "BOOT",
      momentActionTitle: todayState.recommended_action 
        ? ACTION_COPY[todayState.recommended_action].title 
        : "Aguardando",
      actionConsequence: todayState.recommended_action 
        ? ACTION_COPY[todayState.recommended_action].expandedText 
        : "",
      pillarDescriptions: {
        energia: `Energia ${(todayState.energia ?? 0) >= 60 ? "preservada" : "reduzida"}.`,
        clareza: `Clareza ${(todayState.clareza ?? 0) >= 60 ? "boa" : "limitada"}.`,
        estabilidade: `Estabilidade ${(todayState.estabilidade ?? 0) >= 60 ? "adequada" : "comprometida"}.`,
      },
      systemDiagnosis: todayState.action_reason ?? "Estado calculado a partir dos seus dados biométricos.",
      contextInsight: todayState.action_reason ?? "",
      momentActionSystemText: todayState.action_reason ?? "",
      momentActionSubText: todayState.limiting_pillar ?? "",
    };
  }, [hasData, todayState]);

  // Histórico simplificado para UI
  const historyByDay: HistoryDay[] = useMemo(() => {
    if (!dbComputedStates?.length) return [];
    return dbComputedStates.slice(0, 7).map((cs) => ({
      date: cs.date,
      score: cs.vyr_score ?? 0,
      dominantState: (cs.state_label ?? "").toLowerCase(),
      systemNote: (cs.vyr_score ?? 0) >= 80 
        ? "dia favorável, boa capacidade cognitiva"
        : (cs.vyr_score ?? 0) >= 65 
        ? "dia consistente, sem quedas abruptas"
        : (cs.vyr_score ?? 0) >= 50 
        ? "ajustes ao longo do dia" 
        : "dia de recuperação necessária",
    }));
  }, [dbComputedStates]);

  // Checkpoints mapeados
  const checkpoints: Checkpoint[] = useMemo(() => {
    if (!dbCheckpoints?.length) return [];
    return dbCheckpoints.map((cp) => ({
      id: cp.id,
      timestamp: new Date(cp.created_at ?? Date.now()),
      note: cp.note ?? undefined,
    }));
  }, [dbCheckpoints]);

  // Action logs mapeados
  const actionLogs: ActionLog[] = useMemo(() => {
    if (!dbActionLogs?.length) return [];
    return dbActionLogs.map((al) => ({
      id: al.id,
      timestamp: new Date(al.created_at ?? Date.now()),
      action: al.action as MomentAction,
    }));
  }, [dbActionLogs]);

  // Daily reviews mapeados
  const dailyReviews: DailyReview[] = useMemo(() => {
    if (!dbDailyReviews?.length) return [];
    return dbDailyReviews.map((dr) => ({
      id: dr.id,
      date: dr.date,
      narrativeStart: dr.narrative_start ?? "",
      narrativeMiddle: dr.narrative_middle ?? "",
      narrativeEnd: dr.narrative_end ?? "",
      valueGenerated: dr.value_generated ?? "",
      closingLine: dr.closing_line ?? "",
    }));
  }, [dbDailyReviews]);

  // === AÇÃO ATUAL ===
  const [currentAction, setCurrentAction] = useState<MomentAction>(
    todayState?.recommended_action ?? "BOOT"
  );

  // Atualiza ação quando dados chegam
  useEffect(() => {
    if (todayState?.recommended_action) {
      setCurrentAction(todayState.recommended_action);
    }
  }, [todayState?.recommended_action]);

  // Sachets tomados hoje
  const sachetsTakenToday = useMemo(() => 
    actionLogs.map((al) => al.action),
    [actionLogs]
  );

  // Confirmação de sachê
  const [sachetConfirmation, setSachetConfirmation] = useState<SachetConfirmation | null>(null);
  
  // Wearable connection state — loaded from user_integrations
  const { data: dbIntegration } = useQuery({
    queryKey: ["user_integration_apple_health"],
    queryFn: async () => {
      // avoid stale auth in iOS WKWebView; ensure valid session before DB writes
      return getAppleHealthStatus();
    },
    refetchOnWindowFocus: true,
    staleTime: 30_000,
  });

  const wearableConnection: WearableConnection = useMemo(() => {
    if (!dbIntegration?.connected) return initialWearableConnection;
    return {
      connected: true,
      provider: "apple_health" as WearableProvider,
      lastSync: dbIntegration.lastSync,
      syncStatus: dbIntegration.lastSync ? "synced" : "pending",
      baselineDays: 0,
    };
  }, [dbIntegration]);

  // === ACTIONS ===

  const addCheckpoint = useCallback(async (note?: string) => {
    const userId = await getValidUserId();
    if (!userId) return;
    await retryOnAuthError(() =>
      supabase.from("checkpoints").insert({
        user_id: userId,
        note: note ?? null,
      })
    );
  }, []);

  const logAction = useCallback(async (action: MomentAction) => {
    const userId = await getValidUserId();
    if (!userId) return;

    await retryOnAuthError(() =>
      supabase.from("action_logs").insert({
        user_id: userId,
        action,
      })
    );

    // Mostra confirmação
    setSachetConfirmation({
      action,
      timestamp: new Date(),
      nextReadingIn: action === "BOOT" ? "2-3 horas" : action === "HOLD" ? "3-4 horas" : "amanhã",
    });

    // Próxima ação
    const updatedSachets = [...sachetsTakenToday, action];
    const nextAction = getRecommendedAction(
      state.pillars,
      state.vyrStateScore,
      { hourOfDay: new Date().getHours(), sachetsTakenToday: updatedSachets }
    );
    setCurrentAction(nextAction);
  }, [sachetsTakenToday, state]);

  const dismissConfirmation = useCallback(() => {
    setSachetConfirmation(null);
  }, []);

  const activateTransition = useCallback((action: MomentAction) => {
    logAction(action);
  }, [logAction]);

  // Wearable connection actions — now use real HealthKit + DB
  const connectWearable = useCallback(async (provider: WearableProvider) => {
    if (provider === "apple_health") {
      const result = await connectAppleHealth();
      if (!result.success) {
        console.warn("[VYR] Apple Health connect failed:", result.error);
      }
    }
    // Refresh integration query
    queryClient.invalidateQueries({ queryKey: ["user_integration_apple_health"] });
  }, [queryClient]);

  const disconnectWearable = useCallback(async () => {
    await disconnectAppleHealth();
    queryClient.invalidateQueries({ queryKey: ["user_integration_apple_health"] });
  }, [queryClient]);

  const syncWearable = useCallback(async () => {
    await syncHealthKitData();
    queryClient.invalidateQueries({ queryKey: ["user_integration_apple_health"] });
  }, [queryClient]);

  return {
    // Estado principal
    state,
    hasData,
    checkpoints,
    dailyReviews,
    actionLogs,
    historyByDay,
    
    // Contextos (null quando sem dados)
    physiologicalContext: undefined,
    cognitiveWindow: undefined,
    suggestedTransition: undefined,
    detectedPatterns: [] as DetectedPattern[],
    sachetConfirmation,
    todayContext: undefined as DayContext | undefined,
    fullHistory: [] as DayContext[],
    
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
