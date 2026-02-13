import { Moon, Sun } from "lucide-react";
import brainIcon from "@/assets/brain-icon.png";
import { signOut } from "@/lib/api";
import { useTheme } from "@/hooks/use-theme";

type AppHeaderProps = {
  codigo?: string;
};

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

export function AppHeader({ codigo }: AppHeaderProps) {
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-vyr-gray-900 via-vyr-graphite-dark/95 to-vyr-gray-900/90 backdrop-blur-xl border-b border-vyr-graphite/50 safe-area-top">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="min-w-0 flex-1 flex items-center gap-3">
          <img src={brainIcon} alt="VYR" className="w-8 h-8 rounded-sm" />
          <div>
            <h1 className="font-bold text-vyr-white text-sm sm:text-base font-mono tracking-wide">VYR App</h1>
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
