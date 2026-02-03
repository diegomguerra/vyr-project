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
};

interface Permission {
  id: string;
  label: string;
  description: string;
}

const PROVIDER_PERMISSIONS: Record<WearableProvider, Permission[]> = {
  // === RELÓGIOS ===
  apple_health: [
    { id: "hr", label: "Frequência cardíaca", description: "FC contínua, repouso e durante o sono" },
    { id: "hrv", label: "Variabilidade da FC (HRV)", description: "SDNN – excelente qualidade" },
    { id: "sleep", label: "Dados de sono", description: "Duração, estágios, fragmentação" },
    { id: "activity", label: "Atividade física", description: "Passos, calorias, sedentarismo" },
    { id: "spo2", label: "SpO₂", description: "Oxigenação (modelos compatíveis)" },
    { id: "temp", label: "Temperatura do punho", description: "Variação noturna (modelos recentes)" },
  ],
  garmin: [
    { id: "hr", label: "Frequência cardíaca", description: "FC contínua e repouso" },
    { id: "hrv", label: "HRV noturna", description: "Variabilidade durante o sono" },
    { id: "sleep", label: "Dados de sono", description: "Duração, estágios, regularidade" },
    { id: "activity", label: "Atividade física", description: "Carga, intensidade, passos" },
    { id: "stress", label: "Indicadores de estresse", description: "Body Battery, Stress Score" },
  ],
  whoop: [
    { id: "hr", label: "Frequência cardíaca", description: "FC contínua e repouso" },
    { id: "hrv", label: "HRV (RMSSD)", description: "Alta qualidade, contínua" },
    { id: "sleep", label: "Dados de sono", description: "Duração, consistência, eficiência" },
    { id: "strain", label: "Strain e carga", description: "Carga acumulada diária" },
    { id: "recovery", label: "Recuperação", description: "Score de Recovery" },
  ],
  fitbit: [
    { id: "hr", label: "Frequência cardíaca", description: "FC contínua e repouso" },
    { id: "hrv", label: "HRV", description: "Disponível em modelos compatíveis" },
    { id: "sleep", label: "Dados de sono", description: "Duração, estágios, regularidade" },
    { id: "activity", label: "Atividade física", description: "Passos, minutos ativos" },
    { id: "readiness", label: "Daily Readiness", description: "Score de prontidão" },
  ],
  samsung: [
    { id: "hr", label: "Frequência cardíaca", description: "FC contínua" },
    { id: "hrv", label: "HRV", description: "Limitado, varia por modelo" },
    { id: "sleep", label: "Dados de sono", description: "Duração, estágios, regularidade" },
    { id: "activity", label: "Atividade física", description: "Passos, minutos ativos" },
    { id: "spo2", label: "SpO₂", description: "Oxigenação noturna" },
  ],
  xiaomi: [
    { id: "hr", label: "Frequência cardíaca", description: "FC contínua e repouso" },
    { id: "hrv", label: "HRV", description: "Disponível em modelos mais novos" },
    { id: "sleep", label: "Dados de sono", description: "Duração, estágios" },
    { id: "activity", label: "Atividade física", description: "Passos, atividade diária" },
  ],
  polar: [
    { id: "hr", label: "Frequência cardíaca", description: "FC contínua e repouso" },
    { id: "hrv", label: "HRV", description: "Alta qualidade" },
    { id: "sleep", label: "Dados de sono", description: "Duração, qualidade" },
    { id: "activity", label: "Carga física", description: "Carga de treino" },
    { id: "recharge", label: "Nightly Recharge", description: "Recuperação noturna" },
  ],
  huawei: [
    { id: "hr", label: "Frequência cardíaca", description: "FC contínua" },
    { id: "hrv", label: "HRV", description: "Disponível em alguns modelos" },
    { id: "sleep", label: "Dados de sono", description: "Duração, estágios" },
    { id: "activity", label: "Atividade física", description: "Passos, carga" },
  ],
  amazfit: [
    { id: "hr", label: "Frequência cardíaca", description: "FC contínua" },
    { id: "hrv", label: "HRV", description: "Disponível em modelos recentes" },
    { id: "sleep", label: "Dados de sono", description: "Duração, estágios" },
    { id: "activity", label: "Atividade física", description: "Passos, atividade geral" },
  ],
  google_fit: [
    { id: "hr", label: "Frequência cardíaca", description: "Agregado de dispositivos" },
    { id: "sleep", label: "Dados de sono", description: "Agregado de dispositivos" },
    { id: "activity", label: "Atividade física", description: "Passos, exercícios" },
  ],
  
  // === SMART RINGS ===
  oura: [
    { id: "hr", label: "FC noturna", description: "Frequência cardíaca durante o sono" },
    { id: "hrv", label: "HRV noturna", description: "Alta qualidade, excelente baseline" },
    { id: "sleep", label: "Dados de sono", description: "Duração, estágios, consistência, cronotipo" },
    { id: "temp", label: "Temperatura corporal", description: "Variação noturna – diferencial" },
    { id: "activity", label: "Atividade diária", description: "Movimento, inatividade" },
  ],
  ringconn: [
    { id: "hr", label: "Frequência cardíaca", description: "FC principalmente noturna" },
    { id: "hrv", label: "HRV noturna", description: "Variabilidade durante o sono" },
    { id: "sleep", label: "Dados de sono", description: "Duração, estágios, regularidade" },
    { id: "spo2", label: "SpO₂", description: "Oxigenação noturna" },
    { id: "temp", label: "Temperatura periférica", description: "Variação relativa" },
  ],
  ultrahuman: [
    { id: "hr", label: "FC noturna", description: "Frequência cardíaca durante o sono" },
    { id: "hrv", label: "HRV noturna", description: "Variabilidade durante o sono" },
    { id: "sleep", label: "Dados de sono", description: "Duração, estágios, consistência" },
    { id: "temp", label: "Temperatura noturna", description: "Variação térmica" },
    { id: "recovery", label: "Recuperação", description: "Leitura metabólica" },
  ],
  circular: [
    { id: "hr", label: "Frequência cardíaca", description: "FC contínua" },
    { id: "hrv", label: "HRV", description: "Variabilidade cardíaca" },
    { id: "sleep", label: "Dados de sono", description: "Duração, estágios, regularidade" },
    { id: "activity", label: "Atividade diária", description: "Passos, movimento" },
  ],
  movano: [
    { id: "hr", label: "Frequência cardíaca", description: "FC durante o sono" },
    { id: "hrv", label: "HRV", description: "Limitado" },
    { id: "sleep", label: "Dados de sono", description: "Duração, estágios" },
    { id: "temp", label: "Temperatura", description: "Variação térmica" },
    { id: "spo2", label: "SpO₂", description: "Oxigenação" },
  ],
  jstyle: [
    { id: "hr", label: "FC noturna", description: "FC média em repouso" },
    { id: "hrv", label: "HRV noturna", description: "RMSSD ou SDNN simplificado" },
    { id: "sleep", label: "Dados de sono", description: "Duração, estágios básicos, fragmentação" },
    { id: "activity", label: "Atividade diária", description: "Passos, tempo ativo" },
    { id: "spo2", label: "SpO₂ noturno", description: "Modelos específicos" },
  ],
};

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
        {PROVIDER_PERMISSIONS[provider].map((permission, index) => (
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
