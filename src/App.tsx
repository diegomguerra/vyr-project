// VYR Labs App - Navegação principal conforme spec

import { useState, useEffect, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Welcome from "./pages/Welcome";
import { AppHeader } from "@/components/AppHeader";
import { NavSidebar } from "./components/nzt";
import { getParticipante, createParticipante } from "./lib/api";
import { ThemeProvider } from "./hooks/use-theme";
import type { Participante } from "./lib/types";

const queryClient = new QueryClient();

const NAV_ITEMS = [
  { to: "/painel", label: "Painel", icon: "📊" },
  { to: "/anamnese", label: "Anamnese", icon: "📋" },
  { to: "/perfil", label: "Perfil", icon: "👤" },
];

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
    <div className="min-h-screen vyr-gradient-bg">
      <AppHeader codigo={participante?.codigo} />
      <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-[220px_1fr] gap-4 p-3 sm:p-4 pb-24 lg:pb-4">
        {/* Sidebar - hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          <NavSidebar />
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
          historyByDay={historyByDay}
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
