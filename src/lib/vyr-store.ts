// VYR Labs - Mock Store (dados ricos conforme prompt definitivo)

import { useState, useCallback } from "react";
import type { VYRState, Checkpoint, DailyReview, ActionLog, MomentAction, HistoryDay } from "./vyr-types";

// Estado inicial mock - RICO EM SIGNIFICADO
const initialState: VYRState = {
  // Estado base
  vyrStateScore: 78,
  stateLabel: "Energia estável",
  pillars: {
    energia: 4,
    clareza: 5,
    estabilidade: 3,
  },
  
  // Card 1 - Estado Geral
  microDescription: "Foco sustentado com boa clareza mental.",
  
  // Card 2 - Leitura do Sistema
  systemReading: {
    whyScore: "Clareza elevada e energia controlada.",
    limitingFactor: "O limitante hoje é a estabilidade ao longo do tempo.",
    dayRisk: "Evite sobrecarga cognitiva prolongada.",
  },
  
  // Card 3 - Hoje isso significa
  todayMeaning: [
    "Boa capacidade de manter foco contínuo",
    "Melhor desempenho com pausas estratégicas",
  ],
  
  // Card 4 - Ação
  momentAction: "HOLD",
  momentActionTitle: "Ativar HOLD",
  actionConsequence: "Manter foco estável pelas próximas horas, priorizando economia cognitiva.",
  
  // Detalhe de Estado - Pilares interpretados
  pillarDescriptions: {
    energia: "Energia disponível, porém controlada.",
    clareza: "Boa capacidade de foco e processamento.",
    estabilidade: "Sustentação moderada ao longo do tempo.",
  },
  
  // Detalhe de Estado - Diagnóstico
  systemDiagnosis: "O sistema indica um estado favorável para execução. O principal cuidado hoje é evitar longos períodos sem pausa.",
  
  // Legado
  contextInsight: "Ritmo consistente. Ajustes finos tendem a funcionar melhor.",
  momentActionSystemText: "Janela de sustentação detectada.",
  momentActionSubText: "Manutenção do estado atual.",
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

// Reviews mock - COM VALOR GERADO
const initialReviews: DailyReview[] = [
  {
    id: "rev-1",
    date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    narrativeStart: "Você iniciou o dia com estabilidade moderada.",
    narrativeMiddle: "Ajustou o ritmo conforme as demandas cognitivas.",
    narrativeEnd: "Finalizou o dia com clareza funcional.",
    valueGenerated: "O sistema manteve coerência entre estado e estratégia ao longo do dia.",
    closingLine: "Ciclo concluído.",
  },
];

// Action logs mock
const initialActionLogs: ActionLog[] = [];

// Histórico por dia - RICO
const initialHistoryByDay: HistoryDay[] = [
  { 
    date: new Date().toISOString().slice(0, 10), 
    score: 78,
    dominantState: "foco sustentado",
    systemNote: "dia consistente, sem quedas abruptas"
  },
  { 
    date: new Date(Date.now() - 86400000).toISOString().slice(0, 10), 
    score: 72,
    dominantState: "energia moderada",
    systemNote: "ajustes ao longo do dia"
  },
  { 
    date: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10), 
    score: 81,
    dominantState: "clareza elevada",
    systemNote: "bom aproveitamento da janela matinal"
  },
  { 
    date: new Date(Date.now() - 86400000 * 3).toISOString().slice(0, 10), 
    score: 68,
    dominantState: "recuperação",
    systemNote: "padrão esperado após dia intenso"
  },
  { 
    date: new Date(Date.now() - 86400000 * 4).toISOString().slice(0, 10), 
    score: 75,
    dominantState: "sustentação",
    systemNote: "ritmo estável mantido"
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

// Hook para gerenciar o store
export function useVYRStore() {
  const [state, setState] = useState<VYRState>(initialState);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>(initialCheckpoints);
  const [dailyReviews] = useState<DailyReview[]>(initialReviews);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>(initialActionLogs);
  const [historyByDay] = useState<HistoryDay[]>(initialHistoryByDay);

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
          actionConsequence: "Manter foco estável pelas próximas horas, priorizando economia cognitiva.",
        };
      }
      if (action === "HOLD") {
        return {
          ...prev,
          momentAction: "CLEAR",
          momentActionTitle: "Iniciar CLEAR",
          stateLabel: "Sustentando",
          actionConsequence: "Facilitar transição para recuperação, preservando o que foi construído.",
        };
      }
      if (action === "CLEAR") {
        return {
          ...prev,
          momentAction: "BOOT",
          momentActionTitle: "Iniciar BOOT",
          stateLabel: "Recuperando",
          actionConsequence: "Iniciar novo ciclo quando o sistema indicar prontidão.",
        };
      }
      return prev;
    });
  }, []);

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
