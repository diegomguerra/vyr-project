// VYR Labs - Types (versão rica em significado)

export type MomentAction = "BOOT" | "HOLD" | "CLEAR";

export interface VYRPillars {
  energia: number; // 0-5
  clareza: number; // 0-5
  estabilidade: number; // 0-5
}

export interface PillarDescriptions {
  energia: string;
  clareza: string;
  estabilidade: string;
}

export interface SystemReading {
  whyScore: string;      // Por que o score é esse
  limitingFactor: string; // Qual o limitante
  dayRisk: string;        // Qual o risco do dia
}

export interface VYRState {
  // Estado base
  vyrStateScore: number; // 0-100
  stateLabel: string;
  pillars: VYRPillars;
  
  // Home rica - Card 1
  microDescription: string; // "Foco sustentado com boa clareza mental"
  
  // Home rica - Card 2 (Leitura do Sistema)
  systemReading: SystemReading;
  
  // Home rica - Card 3 (Hoje isso significa)
  todayMeaning: string[]; // 2 bullets de consequência prática
  
  // Home rica - Card 4 (Ação)
  momentAction: MomentAction;
  momentActionTitle: string;
  actionConsequence: string; // Texto abaixo do botão
  
  // Detalhe de Estado - Pilares interpretados
  pillarDescriptions: PillarDescriptions;
  
  // Detalhe de Estado - Diagnóstico
  systemDiagnosis: string; // 2+ frases
  
  // Legado (mantidos para compatibilidade)
  contextInsight: string;
  momentActionSystemText: string;
  momentActionSubText: string;
}

export interface Checkpoint {
  id: string;
  timestamp: Date;
  note?: string;
}

export interface DailyReview {
  id: string;
  date: string; // ISO date
  narrativeStart: string;
  narrativeMiddle: string;
  narrativeEnd: string;
  valueGenerated: string; // OBRIGATÓRIO - valor do sistema
  closingLine: string;
}

export interface HistoryDay {
  date: string;
  score: number;
  dominantState: string;  // "foco sustentado"
  systemNote: string;     // "dia consistente, sem quedas"
}

export interface ActionLog {
  id: string;
  timestamp: Date;
  action: MomentAction;
}

export interface VYRStore {
  state: VYRState;
  checkpoints: Checkpoint[];
  dailyReviews: DailyReview[];
  actionLogs: ActionLog[];
  historyByDay: HistoryDay[];
}
