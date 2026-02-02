import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Sun, Moon, Brain } from "lucide-react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Welcome from "./pages/Welcome";
import { NavSidebar } from "./components/nzt";
import { signOut, getParticipante, createParticipante } from "./lib/api";
import { ThemeProvider, useTheme } from "./hooks/use-theme";
import type { Participante } from "./lib/types";

const queryClient = new QueryClient();

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="nzt-btn p-2 rounded-full"
      aria-label={theme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function Header({ codigo }: { codigo?: string }) {
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-vyr-gray-900 via-vyr-graphite-dark/95 to-vyr-gray-900/90 backdrop-blur-xl border-b border-vyr-graphite/50 safe-area-top">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="min-w-0 flex-1 flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-vyr-graphite to-vyr-accent flex items-center justify-center shadow-lg shadow-vyr-accent/10">
            <Brain className="w-4 h-4 text-vyr-white" />
          </div>
          <div>
            <h1 className="font-bold text-vyr-white text-sm sm:text-base font-mono tracking-wide">VYR Labs</h1>
            <p className="text-[10px] sm:text-xs text-vyr-gray-400">
              {codigo ? `ID: ${codigo}` : "Carregando..."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <ThemeToggle />
          <button
            className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-sm text-xs sm:text-sm font-medium text-vyr-gray-300 hover:text-vyr-white hover:bg-vyr-graphite/50 border border-vyr-graphite/50 transition-all"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}

const NAV_ITEMS = [
  { to: "/painel", label: "Painel", icon: "📊" },
  { to: "/anamnese", label: "Anamnese", icon: "📋" },
  { to: "/perfil", label: "Perfil", icon: "👤" },
];

function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-vyr-graphite-dark/95 backdrop-blur-xl border-t border-vyr-graphite/50 safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-sm text-vyr-gray-400 hover:text-vyr-white hover:bg-vyr-graphite/50 transition-all min-w-0"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

function AuthenticatedApp() {
  const [participante, setParticipante] = useState<Participante | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initParticipante = async () => {
      try {
        let p = await getParticipante();

        // Se não existe participante, cria um novo
        if (!p) {
          await createParticipante({});
          p = await getParticipante();
        }

        setParticipante(p);
      } catch (error) {
        console.error("Error initializing participante:", error);
      } finally {
        setLoading(false);
      }
    };

    initParticipante();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center vyr-gradient-bg">
        <div className="text-vyr-gray-400 font-mono text-sm">Inicializando...</div>
      </div>
    );
  }

  // Se participante não tiver onboarding completo, mostra Welcome em tela cheia
  const needsOnboarding = participante && !participante.onboarding_completo;

  if (needsOnboarding) {
    return (
      <Routes>
        <Route path="/*" element={<Welcome />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen vyr-gradient-bg">
      <Header codigo={participante?.codigo} />
      <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-[220px_1fr] gap-4 p-3 sm:p-4 pb-24 lg:pb-4">
        {/* Sidebar - hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          <NavSidebar />
        </div>
        <main className="flex flex-col gap-4 animate-fade-in min-w-0">
          <Routes>
            <Route path="/" element={<Navigate to="/painel" replace />} />
            <Route path="/painel" element={<Dashboard />} />
            <Route path="/anamnese" element={<Onboarding />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="*" element={<Navigate to="/painel" replace />} />
          </Routes>
        </main>
      </div>
      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  );
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center vyr-gradient-bg">
        <div className="text-vyr-gray-400 font-mono text-sm">Carregando...</div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Unauthenticated → Login */}
              <Route path="/" element={user ? <Navigate to="/painel" replace /> : <Login />} />
              
              {/* Authenticated routes */}
              <Route path="/painel" element={user ? <AuthenticatedApp /> : <Navigate to="/" replace />} />
              <Route path="/anamnese" element={user ? <AuthenticatedApp /> : <Navigate to="/" replace />} />
              <Route path="/perfil" element={user ? <AuthenticatedApp /> : <Navigate to="/" replace />} />
              
              {/* Legacy redirect */}
              <Route path="/app/*" element={<Navigate to="/painel" replace />} />
              <Route path="/labs" element={<Navigate to="/" replace />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
