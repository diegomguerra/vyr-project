// VYR Labs App - Navegação principal conforme spec

import { useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import StateDetail from "./pages/StateDetail";
import MomentAction from "./pages/MomentAction";
import Checkpoint from "./pages/Checkpoint";
import DayReview from "./pages/DayReview";
import Labs from "./pages/Labs";
import { useVYRStore, getGreeting } from "./lib/vyr-store";
import type { DailyReview as DailyReviewType } from "./lib/vyr-types";

const queryClient = new QueryClient();

// Tipo de tela ativa
type Screen = 
  | "home" 
  | "stateDetail" 
  | "momentAction" 
  | "checkpoint" 
  | "dayReview" 
  | "labs";

function VYRApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedReview, setSelectedReview] = useState<DailyReviewType | null>(null);
  const [showCheckpoint, setShowCheckpoint] = useState(false);

  const {
    state,
    checkpoints,
    dailyReviews,
    historyByDay,
    physiologicalContext,
    cognitiveWindow,
    suggestedTransition,
    sachetConfirmation,
    detectedPatterns,
    addCheckpoint,
    logAction,
    dismissConfirmation,
    activateTransition,
  } = useVYRStore();

  const greeting = getGreeting("Diego");

  // Handlers de navegação
  const goHome = useCallback(() => setScreen("home"), []);
  const goStateDetail = useCallback(() => setScreen("stateDetail"), []);
  const goMomentAction = useCallback(() => setScreen("momentAction"), []);
  const goLabs = useCallback(() => setScreen("labs"), []);

  // Handler de ação confirmada
  const handleActionConfirm = useCallback(() => {
    logAction(state.momentAction);
    setScreen("home");
  }, [logAction, state.momentAction]);

  // Handler de checkpoint
  const handleCheckpointSave = useCallback((note?: string) => {
    addCheckpoint(note);
    setShowCheckpoint(false);
  }, [addCheckpoint]);

  // Handler de review
  const handleReviewTap = useCallback((review: DailyReviewType) => {
    setSelectedReview(review);
    setScreen("dayReview");
  }, []);

  // Voltar do dayReview para labs
  const handleDayReviewBack = useCallback(() => {
    setSelectedReview(null);
    setScreen("labs");
  }, []);

  // Handler para adicionar observação após confirmação de sachê
  const handleAddObservation = useCallback(() => {
    dismissConfirmation();
    setShowCheckpoint(true);
  }, [dismissConfirmation]);

  return (
    <div className="min-h-screen bg-vyr-bg-primary">
      {/* Checkpoint Modal */}
      {showCheckpoint && (
        <Checkpoint
          onSave={handleCheckpointSave}
          onDismiss={() => setShowCheckpoint(false)}
        />
      )}

      {/* Screens */}
      {screen === "home" && (
        <Home
          state={state}
          greeting={greeting}
          historyByDay={historyByDay}
          physiologicalContext={physiologicalContext}
          cognitiveWindow={cognitiveWindow}
          suggestedTransition={suggestedTransition}
          sachetConfirmation={sachetConfirmation}
          onScoreTap={goStateDetail}
          onActionTap={goMomentAction}
          onActivateTransition={activateTransition}
          onDismissConfirmation={dismissConfirmation}
          onAddObservation={handleAddObservation}
        />
      )}

      {screen === "stateDetail" && (
        <StateDetail state={state} onBack={goHome} />
      )}

      {screen === "momentAction" && (
        <MomentAction
          action={state.momentAction}
          onBack={goHome}
          onConfirm={handleActionConfirm}
        />
      )}

      {screen === "dayReview" && selectedReview && (
        <DayReview review={selectedReview} onBack={handleDayReviewBack} />
      )}

      {screen === "labs" && (
        <Labs
          historyByDay={historyByDay}
          checkpoints={checkpoints}
          dailyReviews={dailyReviews}
          detectedPatterns={detectedPatterns}
          onBack={goHome}
          onReviewTap={handleReviewTap}
        />
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-vyr-bg-surface/95 backdrop-blur-sm border-t border-vyr-stroke-divider px-6 py-3 z-20">
        <div className="flex justify-around max-w-md mx-auto">
          <button
            onClick={goHome}
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-colors ${
              screen === "home" ? "text-vyr-accent-action" : "text-vyr-text-muted"
            }`}
          >
            <span className="text-lg">🏠</span>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={goLabs}
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-colors ${
              screen === "labs" || screen === "dayReview" ? "text-vyr-accent-action" : "text-vyr-text-muted"
            }`}
          >
            <span className="text-lg">🧪</span>
            <span className="text-xs font-medium">Labs</span>
          </button>
          <button
            onClick={() => setShowCheckpoint(true)}
            className="flex flex-col items-center gap-1 px-4 py-1 rounded-lg text-vyr-text-muted transition-colors"
          >
            <span className="text-lg">📍</span>
            <span className="text-xs font-medium">Checkpoint</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

// App principal
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <VYRApp />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
