// VYR Labs - Mock Store (dados locais conforme spec)

import { useState, useCallback } from "react";
import type { VYRState, Checkpoint, DailyReview, ActionLog, MomentAction } from "./vyr-types";

// Estado inicial mock
const initialState: VYRState = {
  vyrStateScore: 78,
  stateLabel: "Energia estável",
  pillars: {
    energia: 4,
    clareza: 5,
    estabilidade: 3,
  },
  contextInsight: "Ritmo consistente. Ajustes finos tendem a funcionar melhor.",
  momentAction: "BOOT",
  momentActionTitle: "Iniciar BOOT",
  momentActionSystemText: "Sistema pronto para iniciar foco.",
  momentActionSubText: "Ativação cognitiva leve e progressiva.",
};

// Checkpoints mock
const initialCheckpoints: Checkpoint[] = [
  {
    id: "cp-1",
    timestamp: new Date(Date.now() - 86400000 * 2),
    note: "Manhã com clareza elevada",
  },
  {
    id: "cp-2",
    timestamp: new Date(Date.now() - 86400000),
  },
];

// Reviews mock
const initialReviews: DailyReview[] = [
  {
    id: "rev-1",
    date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    narrativeStart: "Você iniciou o dia com estabilidade moderada.",
    narrativeMiddle: "Ajustou o ritmo ao longo do dia.",
    narrativeEnd: "Encerrou com clareza funcional.",
    closingLine: "Ciclo concluído.",
  },
];

// Action logs mock
const initialActionLogs: ActionLog[] = [];

// Textos por tipo de ação
export const ACTION_COPY: Record<MomentAction, {
  title: string;
  systemText: string;
  subText: string;
  buttonText: string;
}> = {
  BOOT: {
    title: "Início de ciclo",
    systemText: "Sistema pronto para iniciar foco.",
    subText: "Ativação cognitiva leve e progressiva.",
    buttonText: "Entrar em BOOT",
  },
  HOLD: {
    title: "Sustentação",
    systemText: "Janela de sustentação detectada.",
    subText: "Manutenção do estado atual.",
    buttonText: "Ativar HOLD",
  },
  CLEAR: {
    title: "Encerramento",
    systemText: "Encerramento cognitivo disponível.",
    subText: "Transição para recuperação.",
    buttonText: "Iniciar CLEAR",
  },
};

// Hook para gerenciar o store
export function useVYRStore() {
  const [state, setState] = useState<VYRState>(initialState);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>(initialCheckpoints);
  const [dailyReviews] = useState<DailyReview[]>(initialReviews);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>(initialActionLogs);

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

    // Atualiza estado baseado na ação
    setState((prev) => {
      if (action === "BOOT") {
        return {
          ...prev,
          momentAction: "HOLD",
          momentActionTitle: "Ativar HOLD",
          stateLabel: "Em foco",
        };
      }
      if (action === "HOLD") {
        return {
          ...prev,
          momentAction: "CLEAR",
          momentActionTitle: "Iniciar CLEAR",
          stateLabel: "Sustentando",
        };
      }
      if (action === "CLEAR") {
        return {
          ...prev,
          momentAction: "BOOT",
          momentActionTitle: "Iniciar BOOT",
          stateLabel: "Recuperando",
        };
      }
      return prev;
    });
  }, []);

  // Histórico por dia (mock)
  const historyByDay = [
    { date: new Date().toISOString().slice(0, 10), score: state.vyrStateScore },
    { date: new Date(Date.now() - 86400000).toISOString().slice(0, 10), score: 72 },
    { date: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10), score: 81 },
    { date: new Date(Date.now() - 86400000 * 3).toISOString().slice(0, 10), score: 68 },
    { date: new Date(Date.now() - 86400000 * 4).toISOString().slice(0, 10), score: 75 },
  ];

  return {
    state,
    checkpoints,
    dailyReviews,
    actionLogs,
    historyByDay,
    addCheckpoint,
    logAction,
  };
}

// Função para obter saudação baseada na hora
export function getGreeting(name: string = "Diego"): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Bom dia, ${name}`;
  if (hour < 18) return `Boa tarde, ${name}`;
  return `Boa noite, ${name}`;
}

// Função para formatar data
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

// Função para formatar hora
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
