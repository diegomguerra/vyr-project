// VYR Labs - Types (versão rica em significado)

export type MomentAction = "BOOT" | "HOLD" | "CLEAR";
export type ActivityLevel = "low" | "medium" | "high";
export type PillarType = "energia" | "clareza" | "estabilidade";
export type ContextStatus = "favorable" | "attention" | "limiting";

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

// ===== NOVOS TIPOS - BIOMARCADORES E ENGINE =====

// Dados crus da pulseira (NUNCA exibidos ao usuário)
export interface WearableData {
  date: string;
  rhr: number;                    // 55-80 bpm típico
  hrvIndex: number;               // 0-100 (normalizado)
  sleepDuration: number;          // em horas decimais
  sleepQuality: number;           // 0-100
  sleepRegularity: number;        // -60 a +60 min vs média
  awakenings: number;             // 0-10+
  previousDayActivity: ActivityLevel;
  stressScore: number;            // 0-100
}

// Estado computado pela VYR Engine
export interface ComputedState {
  // Pilares derivados (0-5)
  pillars: VYRPillars;
  
  // Score final (0-100)
  vyrScore: number;
  
  // Interpretações
  stateLabel: string;
  dominantPillar: PillarType;
  limitingPillar: PillarType;
  
  // Ação recomendada
  recommendedAction: MomentAction;
  actionReason: string;
}

// Contexto fisiológico qualitativo (o que o usuário VÊ)
export interface ContextItem {
  label: string;
  status: ContextStatus;
}

export interface PhysiologicalContext {
  items: ContextItem[];
}

// Janela cognitiva (proativo)
export interface CognitiveWindow {
  available: boolean;
  duration: string;         // "3-4 horas"
  suggestion: string;       // "Considere priorizar tarefas que exigem concentração"
}

// Transição sugerida
export interface SuggestedTransition {
  available: boolean;
  targetAction: MomentAction;
  reason: string;
}

// Contexto completo do dia
export interface DayContext {
  date: string;
  wearableData: WearableData;
  computedState: ComputedState;
  physiologicalContext: PhysiologicalContext;
  cognitiveWindow: CognitiveWindow;
  suggestedTransition: SuggestedTransition;
  sachetsUsed: MomentAction[];
  checkpoints: Checkpoint[];
}

// Padrão detectado (para Labs)
export interface DetectedPattern {
  id: string;
  description: string;
  correlation?: string;    // "positiva" | "negativa"
  period: string;          // "Últimos 14 dias"
}

// Confirmação de sachê
export interface SachetConfirmation {
  action: MomentAction;
  timestamp: Date;
  nextReadingIn: string;   // "aproximadamente 2-3 horas"
}

// ===== STORE TYPES =====

export interface VYRStore {
  state: VYRState;
  checkpoints: Checkpoint[];
  dailyReviews: DailyReview[];
  actionLogs: ActionLog[];
  historyByDay: HistoryDay[];
}
