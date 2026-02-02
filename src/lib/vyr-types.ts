// VYR Labs - Types (conforme spec do prompt)

export type MomentAction = "BOOT" | "HOLD" | "CLEAR";

export interface VYRPillars {
  energia: number; // 0-5
  clareza: number; // 0-5
  estabilidade: number; // 0-5
}

export interface VYRState {
  vyrStateScore: number; // 0-100
  stateLabel: string;
  pillars: VYRPillars;
  contextInsight: string;
  momentAction: MomentAction;
  momentActionTitle: string;
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
  closingLine: string;
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
}
