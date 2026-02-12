// VYR Labs App - Navegação principal conforme spec

import { useState, useCallback } from "react";
import { Home as HomeIcon, FlaskConical, Settings as SettingsIcon } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Login from "./pages/Login";
import Home from "./pages/Home";
import StateDetail from "./pages/StateDetail";
import MomentAction from "./pages/MomentAction";
import Checkpoint from "./pages/Checkpoint";
import DayReview from "./pages/DayReview";
import Labs from "./pages/Labs";
import WearableSetup from "./pages/WearableSetup";
import WearablePermissions from "./pages/WearablePermissions";
import Settings from "./pages/Settings";
import { WearableConnected } from "./components/vyr";
import { useVYRStore, getGreeting } from "./lib/vyr-store";
import type { DailyReview as DailyReviewType, WearableProvider } from "./lib/vyr-types";

const queryClient = new QueryClient();

// Tipo de tela ativa
type Screen = 
  | "home" 
  | "stateDetail" 
  | "momentAction" 
  | "checkpoint" 
  | "dayReview" 
  | "labs"
  | "wearableSetup"
  | "wearablePermissions"
  | "settings";

function VYRApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedReview, setSelectedReview] = useState<DailyReviewType | null>(null);
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<WearableProvider | null>(null);
  const [showWearableConnected, setShowWearableConnected] = useState(false);

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
    wearableConnection,
    addCheckpoint,
    logAction,
    dismissConfirmation,
    activateTransition,
    connectWearable,
    disconnectWearable,
    syncWearable,
  } = useVYRStore();

  const greeting = getGreeting("Diego");

  // Handlers de navegação
  const goHome = useCallback(() => setScreen("home"), []);
  const goStateDetail = useCallback(() => setScreen("stateDetail"), []);
  const goMomentAction = useCallback(() => setScreen("momentAction"), []);
  const goLabs = useCallback(() => setScreen("labs"), []);
  const goSettings = useCallback(() => setScreen("settings"), []);
  const goWearableSetup = useCallback(() => setScreen("wearableSetup"), []);

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

  // Wearable handlers
  const handleSelectProvider = useCallback((provider: WearableProvider) => {
    setSelectedProvider(provider);
    setScreen("wearablePermissions");
  }, []);

  const handleAuthorize = useCallback(() => {
    if (selectedProvider) {
      connectWearable(selectedProvider);
      setShowWearableConnected(true);
      setScreen("home");
    }
  }, [selectedProvider, connectWearable]);

  const handleWearableConnectedContinue = useCallback(() => {
    setShowWearableConnected(false);
    setSelectedProvider(null);
  }, []);

  const handleReconnect = useCallback(() => {
    syncWearable();
  }, [syncWearable]);

  const handleDisconnect = useCallback(() => {
    disconnectWearable();
    goHome();
  }, [disconnectWearable, goHome]);

  // Handler para tap no status de conexão
  const handleConnectionTap = useCallback(() => {
    if (wearableConnection.connected) {
      goSettings();
    } else {
      goWearableSetup();
    }
  }, [wearableConnection.connected, goSettings, goWearableSetup]);

  return (
    <div className="min-h-screen bg-vyr-bg-primary">
      {/* Checkpoint Modal */}
      {showCheckpoint && (
        <Checkpoint
          onSave={handleCheckpointSave}
          onDismiss={() => setShowCheckpoint(false)}
        />
      )}

      {/* Wearable Connected Modal */}
      {showWearableConnected && selectedProvider && (
        <WearableConnected
          provider={selectedProvider}
          onContinue={handleWearableConnectedContinue}
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
          wearableConnection={wearableConnection}
          onScoreTap={goStateDetail}
          onActionTap={goMomentAction}
          onActivateTransition={activateTransition}
          onDismissConfirmation={dismissConfirmation}
          onAddObservation={handleAddObservation}
          onConnectionTap={handleConnectionTap}
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

      {screen === "wearableSetup" && (
        <WearableSetup
          onBack={goHome}
          onSelectProvider={handleSelectProvider}
        />
      )}

      {screen === "wearablePermissions" && selectedProvider && (
        <WearablePermissions
          provider={selectedProvider}
          onBack={goWearableSetup}
          onAuthorize={handleAuthorize}
        />
      )}

      {screen === "settings" && (
        <Settings
          connection={wearableConnection}
          onBack={goHome}
          onReconnect={handleReconnect}
          onDisconnect={handleDisconnect}
        />
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-vyr-bg-primary border-t border-vyr-stroke-divider safe-area-bottom z-20">
        <div className="flex justify-around max-w-md mx-auto px-6 py-2">
          <button
            onClick={goHome}
            className={`flex flex-col items-center gap-1 px-5 py-2 transition-colors ${
              screen === "home" ? "text-vyr-text-primary" : "text-vyr-text-muted/60"
            }`}
          >
            <HomeIcon className="w-[18px] h-[18px]" strokeWidth={screen === "home" ? 2 : 1.5} />
            <span className="text-[10px] tracking-wide">Home</span>
          </button>
          <button
            onClick={goLabs}
            className={`flex flex-col items-center gap-1 px-5 py-2 transition-colors ${
              screen === "labs" || screen === "dayReview" ? "text-vyr-text-primary" : "text-vyr-text-muted/60"
            }`}
          >
            <FlaskConical className="w-[18px] h-[18px]" strokeWidth={screen === "labs" || screen === "dayReview" ? 2 : 1.5} />
            <span className="text-[10px] tracking-wide">Labs</span>
          </button>
          <button
            onClick={goSettings}
            className={`flex flex-col items-center gap-1 px-5 py-2 transition-colors ${
              screen === "settings" ? "text-vyr-text-primary" : "text-vyr-text-muted/60"
            }`}
          >
            <SettingsIcon className="w-[18px] h-[18px]" strokeWidth={screen === "settings" ? 2 : 1.5} />
            <span className="text-[10px] tracking-wide">Config</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

// App principal - agora com auth gate
const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-vyr-bg-primary flex items-center justify-center">
        <div className="text-vyr-text-muted text-sm animate-pulse">Carregando...</div>
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
