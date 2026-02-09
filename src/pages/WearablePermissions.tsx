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
  qring: "QRing",
};

interface Permission {
  id: string;
  label: string;
  description: string;
}

const PROVIDER_PERMISSIONS: Record<WearableProvider, Permission[]> = {
  // === RELÓGIOS / BANDS ===
  apple_health: [
    // Cardiofisiológicos
    { id: "hr_continuous", label: "FC contínua", description: "Frequência cardíaca ao longo do dia" },
    { id: "hr_rest", label: "FC de repouso", description: "Frequência cardíaca em repouso" },
    { id: "hrv", label: "HRV (SDNN)", description: "Variabilidade da FC – confiável" },
    { id: "hr_sleep", label: "FC durante o sono", description: "Frequência cardíaca noturna" },
    // Sono
    { id: "sleep_duration", label: "Duração do sono", description: "Tempo total de sono" },
    { id: "sleep_stages", label: "Estágios do sono", description: "Leve, profundo, REM" },
    { id: "sleep_timing", label: "Horários de sono", description: "Início e término" },
    { id: "sleep_frag", label: "Fragmentação", description: "Despertares noturnos" },
    // Atividade
    { id: "steps", label: "Passos", description: "Contagem diária" },
    { id: "calories", label: "Calorias ativas", description: "Gasto calórico de atividade" },
    { id: "active_minutes", label: "Minutos em atividade", description: "Tempo ativo" },
    { id: "sedentary", label: "Sedentarismo", description: "Períodos inativos" },
    // Outros
    { id: "spo2", label: "SpO₂", description: "Oxigenação (modelos compatíveis)" },
    { id: "temp", label: "Temperatura do punho", description: "Variação noturna (modelos recentes)" },
    { id: "respiration", label: "Respiração", description: "Taxa respiratória durante o sono" },
  ],
  garmin: [
    // Cardio
    { id: "hr_continuous", label: "FC contínua", description: "Frequência cardíaca ao longo do dia" },
    { id: "hr_rest", label: "FC repouso", description: "Frequência cardíaca em repouso" },
    { id: "hrv", label: "HRV noturna", description: "Principalmente durante o sono" },
    { id: "respiration", label: "Respiração", description: "Taxa respiratória" },
    // Sono
    { id: "sleep_duration", label: "Duração do sono", description: "Tempo total de sono" },
    { id: "sleep_stages", label: "Estágios do sono", description: "Leve, profundo, REM" },
    { id: "sleep_regularity", label: "Regularidade", description: "Consistência dos horários" },
    // Atividade
    { id: "steps", label: "Passos", description: "Contagem diária" },
    { id: "activity_load", label: "Carga de atividade", description: "Training Load" },
    { id: "intensity", label: "Intensidade", description: "Nível de esforço" },
    // Scores derivados
    { id: "body_battery", label: "Body Battery", description: "Score de energia (auxiliar)" },
    { id: "stress_score", label: "Stress Score", description: "Indicador de estresse (auxiliar)" },
  ],
  whoop: [
    // Cardio
    { id: "hr_continuous", label: "FC contínua", description: "Frequência cardíaca ao longo do dia" },
    { id: "hr_rest", label: "FC repouso", description: "Frequência cardíaca em repouso" },
    { id: "hrv", label: "HRV (RMSSD)", description: "Alta qualidade" },
    // Sono
    { id: "sleep_duration", label: "Duração do sono", description: "Tempo total de sono" },
    { id: "sleep_consistency", label: "Consistência", description: "Regularidade do sono" },
    { id: "sleep_efficiency", label: "Eficiência", description: "Qualidade do sono" },
    // Atividade
    { id: "strain", label: "Strain", description: "Carga de esforço (derivado)" },
    { id: "accumulated_load", label: "Carga acumulada", description: "Esforço total do dia" },
    // Scores proprietários
    { id: "recovery", label: "Recovery", description: "Score de recuperação (auxiliar)" },
    { id: "sleep_score", label: "Sleep Score", description: "Score de sono (auxiliar)" },
  ],
  fitbit: [
    // Cardio
    { id: "hr_continuous", label: "FC contínua", description: "Frequência cardíaca ao longo do dia" },
    { id: "hr_rest", label: "FC repouso", description: "Frequência cardíaca em repouso" },
    { id: "hrv", label: "HRV", description: "Modelos compatíveis" },
    // Sono
    { id: "sleep_duration", label: "Duração do sono", description: "Tempo total de sono" },
    { id: "sleep_stages", label: "Estágios do sono", description: "Leve, profundo, REM" },
    { id: "sleep_regularity", label: "Regularidade", description: "Consistência dos horários" },
    // Atividade
    { id: "steps", label: "Passos", description: "Contagem diária" },
    { id: "active_minutes", label: "Minutos ativos", description: "Tempo em atividade" },
    // Scores
    { id: "readiness", label: "Daily Readiness Score", description: "Prontidão (auxiliar)" },
    { id: "stress_mgmt", label: "Stress Management Score", description: "Estresse (auxiliar)" },
  ],
  samsung: [
    // Cardio
    { id: "hr_continuous", label: "FC contínua", description: "Frequência cardíaca ao longo do dia" },
    { id: "hrv", label: "HRV", description: "Limitado, varia por modelo" },
    { id: "respiration", label: "Respiração", description: "Taxa respiratória" },
    // Sono
    { id: "sleep_duration", label: "Duração do sono", description: "Tempo total de sono" },
    { id: "sleep_stages", label: "Estágios do sono", description: "Leve, profundo, REM" },
    { id: "sleep_regularity", label: "Regularidade", description: "Consistência dos horários" },
    // Atividade
    { id: "steps", label: "Passos", description: "Contagem diária" },
    { id: "active_minutes", label: "Minutos ativos", description: "Tempo em atividade" },
    // Outros
    { id: "spo2", label: "SpO₂", description: "Oxigenação sanguínea" },
    { id: "temp", label: "Temperatura noturna", description: "Modelos recentes" },
  ],
  xiaomi: [
    // Cardio
    { id: "hr_continuous", label: "FC contínua", description: "Frequência cardíaca ao longo do dia" },
    { id: "hr_rest", label: "FC repouso", description: "Frequência cardíaca em repouso" },
    { id: "hrv", label: "HRV", description: "Modelos mais novos" },
    // Sono
    { id: "sleep_duration", label: "Duração do sono", description: "Tempo total de sono" },
    { id: "sleep_stages", label: "Estágios do sono", description: "Leve, profundo, REM" },
    // Atividade
    { id: "steps", label: "Passos", description: "Contagem diária" },
    { id: "activity", label: "Atividade diária", description: "Movimento geral" },
  ],
  polar: [
    // Cardio
    { id: "hr_continuous", label: "FC contínua", description: "Frequência cardíaca ao longo do dia" },
    { id: "hrv", label: "HRV", description: "Alta qualidade" },
    { id: "hr_rest", label: "FC repouso", description: "Frequência cardíaca em repouso" },
    // Sono
    { id: "sleep_duration", label: "Duração do sono", description: "Tempo total de sono" },
    { id: "sleep_quality", label: "Qualidade do sono", description: "Score de qualidade" },
    { id: "nightly_recharge", label: "Nightly Recharge", description: "Recuperação noturna (derivado)" },
    // Atividade
    { id: "training_load", label: "Carga física", description: "Carga de treino" },
  ],
  huawei: [
    // Cardio
    { id: "hr_continuous", label: "FC contínua", description: "Frequência cardíaca ao longo do dia" },
    { id: "hrv", label: "HRV", description: "Alguns modelos" },
    // Sono
    { id: "sleep_duration", label: "Duração do sono", description: "Tempo total de sono" },
    { id: "sleep_stages", label: "Estágios do sono", description: "Leve, profundo, REM" },
    // Atividade
    { id: "steps", label: "Passos", description: "Contagem diária" },
    { id: "activity_load", label: "Carga", description: "Carga de atividade" },
  ],
  amazfit: [
    // Cardio
    { id: "hr_continuous", label: "FC contínua", description: "Frequência cardíaca ao longo do dia" },
    { id: "hrv", label: "HRV", description: "Modelos recentes" },
    // Sono
    { id: "sleep_duration", label: "Duração do sono", description: "Tempo total de sono" },
    { id: "sleep_stages", label: "Estágios do sono", description: "Leve, profundo, REM" },
    // Atividade
    { id: "steps", label: "Passos", description: "Contagem diária" },
    { id: "activity", label: "Atividade geral", description: "Movimento diário" },
  ],
  google_fit: [
    { id: "hr", label: "Frequência cardíaca", description: "Agregado de dispositivos conectados" },
    { id: "sleep", label: "Dados de sono", description: "Agregado de dispositivos conectados" },
    { id: "activity", label: "Atividade física", description: "Passos e exercícios agregados" },
  ],
  
  // === SMART RINGS ===
  jstyle: [
    { id: "hr_night", label: "FC noturna", description: "Frequência cardíaca durante o sono" },
    { id: "hr_rest", label: "FC média em repouso", description: "Frequência cardíaca de repouso" },
    { id: "hrv", label: "HRV noturna", description: "RMSSD ou SDNN simplificado" },
    { id: "sleep_duration", label: "Duração do sono", description: "Tempo total de sono" },
    { id: "sleep_stages", label: "Estágios do sono", description: "Leve, profundo, REM (dependente do firmware)" },
    { id: "sleep_timing", label: "Horários de sono", description: "Início e término" },
    { id: "sleep_frag", label: "Fragmentação", description: "Despertares simples" },
    { id: "steps", label: "Passos", description: "Contagem diária" },
    { id: "active_time", label: "Tempo ativo vs inativo", description: "Distribuição de atividade" },
    { id: "calories", label: "Calorias estimadas", description: "Gasto calórico aproximado" },
    { id: "spo2", label: "SpO₂ noturno", description: "Modelos específicos" },
    { id: "temp", label: "Temperatura periférica", description: "Variação relativa (alguns modelos)" },
  ],
  qring: [
    { id: "hr_night", label: "FC noturna", description: "Frequência cardíaca durante o sono" },
    { id: "hr_rest", label: "FC média em repouso", description: "Frequência cardíaca de repouso (mín noturno)" },
    { id: "hrv", label: "VFC (HRV)", description: "Variabilidade da frequência cardíaca em ms" },
    { id: "sleep_duration", label: "Duração do sono", description: "Tempo total de sono" },
    { id: "sleep_stages", label: "Estágios do sono", description: "Leve, profundo, acordado, movimento ocular" },
    { id: "sleep_efficiency", label: "Eficiência do sono", description: "Percentual de tempo dormindo" },
    { id: "sleep_timing", label: "Horários de sono", description: "Início e término" },
    { id: "sleep_frag", label: "Fragmentação", description: "Tempo acordado durante o sono" },
    { id: "spo2", label: "SpO₂", description: "Oxigênio no sangue contínuo (96-99%)" },
    { id: "temp", label: "Temperatura corporal", description: "Monitoramento contínuo (35.9-38.0°C)" },
    { id: "stress", label: "Estresse", description: "Score de pressão/estresse (0-100)" },
    { id: "steps", label: "Passos", description: "Contagem diária" },
    { id: "calories", label: "Calorias", description: "Gasto calórico estimado" },
    { id: "activity", label: "Atividade", description: "Pontuação e quilometragem" },
  ],
  oura: [
    { id: "hr_night", label: "FC noturna", description: "Frequência cardíaca durante o sono" },
    { id: "hrv", label: "HRV noturna", description: "Alta qualidade – excelente baseline" },
    { id: "hr_rest", label: "FC repouso", description: "Frequência cardíaca de repouso" },
    { id: "sleep_duration", label: "Duração do sono", description: "Tempo total de sono" },
    { id: "sleep_stages", label: "Estágios completos", description: "Leve, profundo, REM detalhado" },
    { id: "sleep_efficiency", label: "Eficiência do sono", description: "Qualidade do sono" },
    { id: "sleep_regularity", label: "Regularidade", description: "Consistência dos horários" },
    { id: "temp", label: "Temperatura corporal", description: "Variação noturna – diferencial core" },
    { id: "activity_light", label: "Atividade leve/moderada", description: "Movimento diário" },
    { id: "inactivity", label: "Inatividade prolongada", description: "Períodos sedentários" },
  ],
  ringconn: [
    { id: "hr_continuous", label: "FC contínua", description: "Principalmente noturna" },
    { id: "hrv", label: "HRV noturna", description: "Variabilidade durante o sono" },
    { id: "hr_rest", label: "FC repouso", description: "Frequência cardíaca de repouso" },
    { id: "sleep_duration", label: "Duração do sono", description: "Tempo total de sono" },
    { id: "sleep_stages", label: "Estágios do sono", description: "Leve, profundo, REM" },
    { id: "sleep_regularity", label: "Regularidade", description: "Consistência dos horários" },
    { id: "steps", label: "Passos", description: "Contagem diária" },
    { id: "activity", label: "Atividade geral", description: "Movimento diário" },
    { id: "spo2", label: "SpO₂", description: "Oxigenação sanguínea" },
    { id: "temp", label: "Temperatura periférica", description: "Variação relativa" },
  ],
  ultrahuman: [
    { id: "hr_night", label: "FC noturna", description: "Frequência cardíaca durante o sono" },
    { id: "hrv", label: "HRV noturna", description: "Variabilidade durante o sono" },
    { id: "hr_rest", label: "FC repouso", description: "Frequência cardíaca de repouso" },
    { id: "sleep_duration", label: "Duração do sono", description: "Tempo total de sono" },
    { id: "sleep_stages", label: "Estágios do sono", description: "Leve, profundo, REM" },
    { id: "sleep_consistency", label: "Consistência", description: "Regularidade dos horários" },
    { id: "temp", label: "Temperatura noturna", description: "Variação térmica" },
    { id: "movement", label: "Movimento diário", description: "Atividade geral" },
    { id: "sedentary", label: "Sedentarismo", description: "Períodos inativos" },
  ],
  circular: [
    { id: "hr", label: "Frequência cardíaca", description: "FC contínua" },
    { id: "hrv", label: "HRV", description: "Variabilidade cardíaca" },
    { id: "sleep_duration", label: "Duração do sono", description: "Tempo total de sono" },
    { id: "sleep_stages", label: "Estágios do sono", description: "Leve, profundo, REM" },
    { id: "sleep_regularity", label: "Regularidade", description: "Consistência dos horários" },
    { id: "steps", label: "Passos", description: "Contagem diária" },
    { id: "movement", label: "Movimento diário", description: "Atividade geral" },
  ],
  movano: [
    { id: "hr", label: "Frequência cardíaca", description: "FC durante o sono" },
    { id: "hrv", label: "HRV", description: "Limitado" },
    { id: "sleep_duration", label: "Duração do sono", description: "Tempo total de sono" },
    { id: "sleep_stages", label: "Estágios do sono", description: "Leve, profundo, REM" },
    { id: "temp", label: "Temperatura", description: "Variação térmica" },
    { id: "spo2", label: "SpO₂", description: "Oxigenação sanguínea" },
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
