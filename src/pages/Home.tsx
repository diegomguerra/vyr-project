// VYR Labs - Home (Visual Whoop-inspired)
// Ring central + 3 pilares + Contexto + Insight + Janela Cognitiva + Ação

import { ChevronRight } from "lucide-react";
import { NotificationBell } from "@/components/vyr";
import { 
  StateRing, 
  PillarRing, 
  InsightCard, 
  ActionButton, 
  ScoreDelta,
  ContextCard,
  CognitiveWindowCard,
  TransitionCard,
  SachetConfirmation,
  ConnectionStatus,
} from "@/components/vyr";
import type { 
  VYRState, 
  HistoryDay, 
  PhysiologicalContext,
  CognitiveWindow,
  SuggestedTransition,
  SachetConfirmation as SachetConfirmationType,
  MomentAction,
  WearableConnection,
} from "@/lib/vyr-types";

interface HomeProps {
  state: VYRState;
  userName?: string;
  greeting: string;
  historyByDay?: HistoryDay[];
  physiologicalContext?: PhysiologicalContext;
  cognitiveWindow?: CognitiveWindow;
  suggestedTransition?: SuggestedTransition;
  sachetConfirmation?: SachetConfirmationType | null;
  wearableConnection: WearableConnection;
  notificationCount?: number;
  onScoreTap: () => void;
  onActionTap: () => void;
  onActivateTransition?: (action: MomentAction) => void;
  onDismissConfirmation?: () => void;
  onAddObservation?: () => void;
  onConnectionTap?: () => void;
  onNotificationsTap?: () => void;
}

export default function Home({ 
  state, 
  greeting, 
  historyByDay = [],
  physiologicalContext,
  cognitiveWindow,
  suggestedTransition,
  sachetConfirmation,
  wearableConnection,
  notificationCount = 0,
  onScoreTap, 
  onActionTap,
  onActivateTransition,
  onDismissConfirmation,
  onAddObservation,
  onConnectionTap,
  onNotificationsTap,
}: HomeProps) {
  // Pegar score de ontem para o delta
  const yesterdayScore = historyByDay.length > 1 ? historyByDay[1].score : state.vyrStateScore;

  return (
    <div className="min-h-screen bg-vyr-bg-primary px-5 pt-6 pb-28 safe-area-top safe-area-left safe-area-right">
      {/* Connection Status + Bell + Saudação */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <p className="text-vyr-text-secondary text-sm">
          {greeting}
        </p>
        <div className="flex items-center gap-1">
          <NotificationBell unreadCount={notificationCount} onClick={onNotificationsTap || (() => {})} />
          <ConnectionStatus 
            connection={wearableConnection} 
            onTap={onConnectionTap} 
          />
        </div>
      </div>

      {/* RING CENTRAL - VYR STATE */}
      <div className="flex flex-col items-center mb-8">
        <StateRing
          value={state.vyrStateScore}
          stateLabel={state.stateLabel}
          onTap={onScoreTap}
        />
        
        {/* Delta vs ontem */}
        <div className="mt-3">
          <ScoreDelta 
            todayScore={state.vyrStateScore} 
            yesterdayScore={yesterdayScore} 
          />
        </div>
      </div>

      {/* 3 MINI RINGS - PILARES com stagger */}
      <div className="flex justify-center gap-8 mb-8">
        <PillarRing
          label="Energia"
          value={state.pillars.energia}
          type="energia"
          staggerIndex={0}
        />
        <PillarRing
          label="Clareza"
          value={state.pillars.clareza}
          type="clareza"
          staggerIndex={1}
        />
        <PillarRing
          label="Estabilidade"
          value={state.pillars.estabilidade}
          type="estabilidade"
          staggerIndex={2}
        />
      </div>

      {/* CONTEXTO FISIOLÓGICO (novo) */}
      {physiologicalContext && (
        <div className="mb-4 animate-stagger-2">
          <ContextCard context={physiologicalContext} />
        </div>
      )}

      {/* JANELA COGNITIVA (novo - condicional) */}
      {cognitiveWindow?.available && (
        <div className="mb-4 animate-stagger-2">
          <CognitiveWindowCard window={cognitiveWindow} />
        </div>
      )}

      {/* INSIGHT CARD - Leitura do Sistema */}
      <div className="mb-4 animate-stagger-3">
        <InsightCard
          type="insight"
          title="Leitura do sistema"
          subtitle="Resumo inteligente do que está acontecendo no seu corpo agora — por que seu score é esse e o que pode limitar seu dia."
          detail={state.systemReading.dayRisk}
        >
          <p>{state.systemReading.whyScore}</p>
          <p className="mt-1 text-vyr-text-muted">
            {state.systemReading.limitingFactor}
          </p>
        </InsightCard>
      </div>

      {/* CARD - Hoje isso significa */}
      <button
        onClick={onScoreTap}
        className="w-full bg-vyr-bg-surface rounded-2xl p-4 mb-4 text-left transition-opacity active:opacity-80 animate-stagger-4"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase">
            Hoje isso significa
          </span>
          <ChevronRight className="w-4 h-4 text-vyr-text-muted" />
        </div>
        <p className="text-vyr-text-muted/70 text-xs mb-3">
          Traduzimos seu estado em impactos reais: o que você pode esperar do seu desempenho hoje.
        </p>
        
        <ul className="space-y-2">
          {state.todayMeaning.map((meaning, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-vyr-accent-action mt-1.5 text-xs">●</span>
              <span className="text-vyr-text-secondary text-sm leading-relaxed">
                {meaning}
              </span>
            </li>
          ))}
        </ul>
      </button>

      {/* TRANSIÇÃO SUGERIDA (novo - condicional) */}
      {suggestedTransition?.available && onActivateTransition && (
        <div className="mb-4 animate-stagger-4">
          <TransitionCard
            transition={suggestedTransition}
            onActivate={onActivateTransition}
          />
        </div>
      )}

      {/* AÇÃO PRINCIPAL */}
      <div className="space-y-3 animate-stagger-4">
        {/* Explicação da ação */}
        <div className="bg-vyr-bg-surface rounded-xl px-4 py-3">
          <span className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase block mb-1">
            {state.momentAction === "BOOT" ? "Próximo passo sugerido" :
             state.momentAction === "HOLD" ? "Modo atual" : "Transição sugerida"}
          </span>
          <p className="text-vyr-text-muted/70 text-xs mb-2">
            {state.momentAction === "BOOT" 
              ? "O sistema recomenda iniciar o ciclo cognitivo. O sachê BOOT prepara seu corpo para foco e produtividade nas próximas horas."
              : state.momentAction === "HOLD"
              ? "Você já ativou o sistema. O sachê HOLD mantém seu estado estável, preservando a clareza mental ao longo do dia."
              : "É hora de preparar a recuperação. O sachê CLEAR sinaliza ao corpo que o período de exigência acabou, otimizando o descanso."}
          </p>
          <p className="text-vyr-text-muted/50 text-[10px]">
            Os sachês fazem parte do protocolo VYR — cada um atua em um momento específico do seu ciclo cognitivo diário.
          </p>
        </div>

        <ActionButton
          action={state.momentAction}
          label={state.momentAction}
          subtitle={`Clique ao tomar ${state.momentAction}`}
          onTap={onActionTap}
        />
        
        <p className="text-vyr-text-muted text-xs leading-relaxed text-center px-4 mt-2">
          Registre aqui quando tomar o sachê para que o VYR acompanhe seu ciclo cognitivo.
        </p>
      </div>

      {/* CONFIRMAÇÃO DE SACHÊ (modal) */}
      {sachetConfirmation && onDismissConfirmation && (
        <SachetConfirmation
          confirmation={sachetConfirmation}
          onAddObservation={onAddObservation}
          onDismiss={onDismissConfirmation}
        />
      )}
    </div>
  );
}
