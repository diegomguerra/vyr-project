// VYR Labs - Wearable Connected Modal
// Confirmação de conexão bem-sucedida

import { CheckCircle2, X } from "lucide-react";
import type { WearableProvider } from "@/lib/vyr-types";

interface WearableConnectedProps {
  provider: WearableProvider;
  onContinue: () => void;
}

const PROVIDER_NAMES: Record<WearableProvider, string> = {
  // Relógios
  apple_health: "Apple Watch",
  garmin: "Garmin",
  whoop: "Whoop",
  fitbit: "Fitbit",
  samsung: "Samsung Galaxy Watch",
  xiaomi: "Xiaomi Mi Band",
  polar: "Polar",
  huawei: "Huawei Watch",
  amazfit: "Amazfit",
  google_fit: "Google Fit",
  // Smart Rings
  oura: "Oura Ring",
  ringconn: "RingConn",
  ultrahuman: "Ultrahuman Ring",
  circular: "Circular Ring",
  movano: "Movano Evie",
  jstyle: "J-Style Ring",
  qring: "QRing",
};

export default function WearableConnected({ provider, onContinue }: WearableConnectedProps) {
  const providerName = PROVIDER_NAMES[provider];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-vyr-bg-surface rounded-3xl p-6 w-full max-w-sm animate-scale-in">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-vyr-accent-positive/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-vyr-accent-positive" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-vyr-text-primary text-xl font-semibold text-center mb-3">
          Conexão estabelecida
        </h2>

        {/* Description */}
        <p className="text-vyr-text-secondary text-center leading-relaxed mb-2">
          O VYR agora recebe sinais do seu
          <br />
          <span className="text-vyr-text-primary font-medium">{providerName}</span> automaticamente.
        </p>

        {/* Timing Note */}
        <p className="text-vyr-text-muted text-sm text-center mb-8">
          A primeira leitura estará disponível
          <br />
          após a próxima noite de sono.
        </p>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full bg-vyr-accent-action text-vyr-bg-primary font-semibold py-4 rounded-2xl transition-all active:scale-[0.98]"
        >
          Continuar para o VYR
        </button>
      </div>
    </div>
  );
}
