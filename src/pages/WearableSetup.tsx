// VYR Labs - Wearable Setup Page
// Tela de seleção de wearable (sem mostrar dados brutos)

import { ChevronLeft, Watch, Activity, Circle, Smartphone, Heart } from "lucide-react";
import type { WearableProvider, WearableProviderInfo } from "@/lib/vyr-types";

interface WearableSetupProps {
  onBack?: () => void;
  onSelectProvider: (provider: WearableProvider) => void;
}

// Relógios / Pulseiras
const WATCH_PROVIDERS: WearableProviderInfo[] = [
  {
    id: "apple_health",
    name: "Apple Watch",
    icon: "watch",
    description: "FC, HRV, sono, atividade via Apple Health",
  },
  {
    id: "garmin",
    name: "Garmin",
    icon: "activity",
    description: "Body Battery, Stress Score, carga de treino",
  },
  {
    id: "whoop",
    name: "Whoop",
    icon: "heart",
    description: "HRV de alta qualidade, Recovery, Strain",
  },
  {
    id: "fitbit",
    name: "Fitbit",
    icon: "activity",
    description: "Daily Readiness, sono, FC contínua",
  },
  {
    id: "samsung",
    name: "Samsung Galaxy Watch",
    icon: "smartphone",
    description: "FC, sono, SpO₂ via Samsung Health",
  },
  {
    id: "xiaomi",
    name: "Xiaomi Mi Band",
    icon: "activity",
    description: "FC, sono, passos – custo-benefício",
  },
  {
    id: "polar",
    name: "Polar",
    icon: "heart",
    description: "HRV de alta qualidade, Nightly Recharge",
  },
  {
    id: "huawei",
    name: "Huawei Watch",
    icon: "watch",
    description: "FC, sono, carga de atividade",
  },
  {
    id: "amazfit",
    name: "Amazfit",
    icon: "activity",
    description: "FC, HRV, sono – alternativa acessível",
  },
  {
    id: "google_fit",
    name: "Google Fit",
    icon: "smartphone",
    description: "Agregador para outros dispositivos Android",
  },
];

// Smart Rings
const RING_PROVIDERS: WearableProviderInfo[] = [
  {
    id: "oura",
    name: "Oura Ring",
    icon: "circle",
    description: "HRV noturna, temperatura, sono – excelente baseline",
  },
  {
    id: "ringconn",
    name: "RingConn",
    icon: "circle",
    description: "FC, HRV, sono, SpO₂, temperatura",
  },
  {
    id: "ultrahuman",
    name: "Ultrahuman Ring Air",
    icon: "circle",
    description: "Recuperação, temperatura, metabolismo",
  },
  {
    id: "circular",
    name: "Circular Ring",
    icon: "circle",
    description: "FC, HRV, sono, alertas hápticos",
  },
  {
    id: "movano",
    name: "Movano Evie Ring",
    icon: "circle",
    description: "Temperatura, sono, foco em saúde feminina",
  },
  {
    id: "qring",
    name: "QRing",
    icon: "circle",
    description: "FC, HRV, SpO2, temperatura, sono, estresse",
  },
  {
    id: "jstyle",
    name: "J-Style Ring",
    icon: "circle",
    description: "FC, HRV, sono – via Apple/Google Health",
  },
];

function ProviderIcon({ icon }: { icon: string }) {
  const iconClass = "w-6 h-6 text-vyr-accent-action";
  switch (icon) {
    case "watch":
      return <Watch className={iconClass} />;
    case "activity":
      return <Activity className={iconClass} />;
    case "circle":
      return <Circle className={iconClass} />;
    case "smartphone":
      return <Smartphone className={iconClass} />;
    case "heart":
      return <Heart className={iconClass} />;
    default:
      return <Activity className={iconClass} />;
  }
}

export default function WearableSetup({ onBack, onSelectProvider }: WearableSetupProps) {
  return (
    <div className="min-h-screen bg-vyr-bg-primary px-5 py-6 pb-28">
      {/* Header */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-vyr-text-muted mb-6 transition-opacity active:opacity-60"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Voltar</span>
        </button>
      )}

      {/* Title */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-vyr-text-primary text-2xl font-semibold mb-2">
          Conecte seu wearable
        </h1>
        <p className="text-vyr-text-secondary text-base leading-relaxed">
          O VYR lê sinais fisiológicos para interpretar seu estado cognitivo.
        </p>
      </div>

      {/* Relógios / Pulseiras */}
      <div className="mb-6 animate-fade-in">
        <h2 className="text-vyr-text-muted text-xs uppercase tracking-wider mb-3 px-1">
          Relógios & Pulseiras
        </h2>
        <div className="space-y-3">
          {WATCH_PROVIDERS.map((provider, index) => (
            <button
              key={provider.id}
              onClick={() => onSelectProvider(provider.id)}
              className="w-full bg-vyr-bg-surface rounded-2xl p-4 flex items-center gap-4 transition-all active:scale-[0.98] active:opacity-90 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-vyr-bg-primary flex items-center justify-center">
                <ProviderIcon icon={provider.icon} />
              </div>
              <div className="flex-1 text-left">
                <span className="text-vyr-text-primary font-medium block">
                  {provider.name}
                </span>
                <span className="text-vyr-text-muted text-sm">
                  {provider.description}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Smart Rings */}
      <div className="mb-8 animate-fade-in">
        <h2 className="text-vyr-text-muted text-xs uppercase tracking-wider mb-3 px-1">
          Smart Rings
        </h2>
        <div className="space-y-3">
          {RING_PROVIDERS.map((provider, index) => (
            <button
              key={provider.id}
              onClick={() => onSelectProvider(provider.id)}
              className="w-full bg-vyr-bg-surface rounded-2xl p-4 flex items-center gap-4 transition-all active:scale-[0.98] active:opacity-90 animate-fade-in"
              style={{ animationDelay: `${(index + WATCH_PROVIDERS.length) * 50}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-vyr-bg-primary flex items-center justify-center">
                <ProviderIcon icon={provider.icon} />
              </div>
              <div className="flex-1 text-left">
                <span className="text-vyr-text-primary font-medium block">
                  {provider.name}
                </span>
                <span className="text-vyr-text-muted text-sm">
                  {provider.description}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Note */}
      <div className="bg-vyr-bg-surface/50 rounded-2xl p-4 animate-fade-in">
        <p className="text-vyr-text-muted text-sm leading-relaxed text-center">
          O VYR nunca mostra seus dados brutos.
          <br />
          Apenas interpreta o significado para você.
        </p>
      </div>
    </div>
  );
}
