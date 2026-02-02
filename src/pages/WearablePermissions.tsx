// VYR Labs - Wearable Permissions Page
// Tela de permissões (OAuth simulado)

import { ChevronLeft, Check, Shield } from "lucide-react";
import type { WearableProvider } from "@/lib/vyr-types";

interface WearablePermissionsProps {
  provider: WearableProvider;
  onBack: () => void;
  onAuthorize: () => void;
}

const PROVIDER_NAMES: Record<WearableProvider, string> = {
  apple_health: "Apple Health",
  garmin: "Garmin Connect",
  oura: "Oura",
  samsung: "Samsung Health",
  whoop: "Whoop",
  google_fit: "Google Fit",
  fitbit: "Fitbit",
};

const PERMISSIONS = [
  { id: "sleep", label: "Dados de sono", description: "Duração, qualidade e regularidade" },
  { id: "hr", label: "Frequência cardíaca", description: "Frequência de repouso e variabilidade" },
  { id: "activity", label: "Atividade física", description: "Passos, exercícios e recuperação" },
  { id: "stress", label: "Indicadores de estresse", description: "Dados de tensão fisiológica" },
];

export default function WearablePermissions({ provider, onBack, onAuthorize }: WearablePermissionsProps) {
  const providerName = PROVIDER_NAMES[provider];

  return (
    <div className="min-h-screen bg-vyr-bg-primary px-5 py-6 pb-28">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-vyr-text-muted mb-6 transition-opacity active:opacity-60"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Voltar</span>
      </button>

      {/* Provider Logo Area */}
      <div className="flex justify-center mb-8 animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-vyr-bg-surface flex items-center justify-center">
          <Shield className="w-10 h-10 text-vyr-accent-action" />
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-vyr-text-primary text-xl font-semibold mb-2">
          Autorizar {providerName}
        </h1>
        <p className="text-vyr-text-secondary text-base">
          O VYR solicita permissão para:
        </p>
      </div>

      {/* Permissions List */}
      <div className="space-y-3 mb-8">
        {PERMISSIONS.map((permission, index) => (
          <div
            key={permission.id}
            className="bg-vyr-bg-surface rounded-xl p-4 flex items-start gap-3 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="w-6 h-6 rounded-full bg-vyr-accent-action/20 flex items-center justify-center mt-0.5">
              <Check className="w-4 h-4 text-vyr-accent-action" />
            </div>
            <div>
              <span className="text-vyr-text-primary font-medium block">
                {permission.label}
              </span>
              <span className="text-vyr-text-muted text-sm">
                {permission.description}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Privacy Note */}
      <div className="bg-vyr-bg-surface/50 rounded-xl p-4 mb-8 animate-fade-in">
        <p className="text-vyr-text-muted text-sm leading-relaxed text-center">
          Esses dados são processados internamente
          <br />e nunca exibidos diretamente.
        </p>
      </div>

      {/* Authorize Button */}
      <button
        onClick={onAuthorize}
        className="w-full bg-vyr-accent-action text-vyr-bg-primary font-semibold py-4 rounded-2xl transition-all active:scale-[0.98] animate-fade-in"
      >
        Autorizar
      </button>

      {/* Legal Note */}
      <p className="text-vyr-text-muted text-xs text-center mt-4 animate-fade-in">
        Ao autorizar, você concorda com a política de privacidade.
      </p>
    </div>
  );
}
