// VYR Labs App - Navegação principal conforme spec

import { useState, useEffect, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Beaker } from "lucide-react";

// Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import StateDetail from "./pages/StateDetail";
import MomentAction from "./pages/MomentAction";
import Checkpoint from "./pages/Checkpoint";
import DayReview from "./pages/DayReview";
import Labs from "./pages/Labs";

// Store
import { useVYRStore, getGreeting } from "./lib/vyr-store";
import type { DailyReview } from "./lib/vyr-types";

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
  const [selectedReview, setSelectedReview] = useState<DailyReview | null>(null);
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [actionConfirmed, setActionConfirmed] = useState(false);

  const {
    state,
    checkpoints,
    dailyReviews,
    historyByDay,
    addCheckpoint,
    logAction,
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
    setActionConfirmed(true);
    setScreen("home");
    // Reset após 3 segundos
    setTimeout(() => setActionConfirmed(false), 3000);
  }, [logAction, state.momentAction]);

  // Handler de checkpoint
  const handleCheckpointSave = useCallback((note?: string) => {
    addCheckpoint(note);
    setShowCheckpoint(false);
  }, [addCheckpoint]);

  // Handler de review
  const handleReviewTap = useCallback((review: DailyReview) => {
    setSelectedReview(review);
    setScreen("dayReview");
  }, []);

  // Voltar do dayReview para labs
  const handleDayReviewBack = useCallback(() => {
    setSelectedReview(null);
    setScreen("labs");
  }, []);

  return (
    <div className="min-h-screen bg-vyr-bg-primary safe-area-top safe-area-bottom">
      {/* Ícone Labs (canto superior direito) - sempre visível na Home */}
      {screen === "home" && (
        <button
          onClick={goLabs}
          className="fixed top-4 right-4 z-40 p-3 rounded-full bg-vyr-bg-surface transition-colors active:bg-vyr-stroke-divider"
          aria-label="Abrir Labs"
        >
          <Beaker className="w-5 h-5 text-vyr-text-muted" />
        </button>
      )}

      {/* Feedback de ação confirmada */}
      {actionConfirmed && (
        <div className="fixed top-4 left-4 right-16 z-40 px-4 py-3 bg-vyr-bg-surface rounded-xl animate-fade-in">
          <p className="text-vyr-text-secondary text-sm text-center">
            {state.momentAction === "HOLD" 
              ? "BOOT iniciado" 
              : state.momentAction === "CLEAR" 
                ? "HOLD ativado" 
                : "CLEAR iniciado"}
          </p>
        </div>
      )}

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
          onScoreTap={goStateDetail}
          onActionTap={goMomentAction}
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
          onBack={goHome}
          onReviewTap={handleReviewTap}
        />
      )}
    </div>
  );
}

// App principal com auth
const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vyr-bg-primary">
        <div className="text-vyr-text-muted text-sm">Carregando...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {user ? <VYRApp /> : <Login />}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
