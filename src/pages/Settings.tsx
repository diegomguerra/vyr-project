// VYR Labs - Settings Page
// Configurações e gerenciamento de wearable

import { ChevronLeft, Watch, RefreshCw, Unlink, Shield, Database, LogOut } from "lucide-react";
import { signOut } from "@/hooks/use-auth";
import type { WearableConnection, WearableProvider } from "@/lib/vyr-types";

interface SettingsProps {
  connection: WearableConnection;
  onBack: () => void;
  onReconnect: () => void;
  onDisconnect: () => void;
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

function formatLastSync(date: Date | null): string {
  if (!date) return "Nunca sincronizado";
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) return "há menos de 1 hora";
  if (diffHours < 24) return `há ${diffHours} horas`;
  return "há mais de 24 horas";
}

export default function Settings({ connection, onBack, onReconnect, onDisconnect }: SettingsProps) {
  const providerName = connection.provider ? PROVIDER_NAMES[connection.provider] : "Nenhum";
  const lastSyncText = formatLastSync(connection.lastSync);

  const statusText = {
    synced: "Conectado",
    pending: "Sincronização pendente",
    error: "Erro de conexão",
  };

  const statusColor = {
    synced: "bg-vyr-status-positive",
    pending: "bg-vyr-status-caution",
    error: "bg-vyr-status-negative",
  };

  return (
    <div className="min-h-screen bg-vyr-bg-primary px-5 pt-6 pb-28 safe-area-top safe-area-left safe-area-right">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-vyr-text-muted mb-6 transition-opacity active:opacity-60"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Voltar</span>
      </button>

      <h1 className="text-vyr-text-primary text-2xl font-semibold mb-8 animate-fade-in">
        Configurações
      </h1>

      {/* Wearable Section */}
      <section className="mb-8 animate-fade-in">
        <h2 className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase mb-4">
          Wearable
        </h2>

        <div className="bg-vyr-bg-surface rounded-2xl p-4 space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vyr-bg-primary flex items-center justify-center">
              <Watch className="w-5 h-5 text-vyr-accent-action" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-vyr-text-primary font-medium">
                  {providerName}
                </span>
                {connection.connected && (
                  <span className={`w-2 h-2 rounded-full ${statusColor[connection.syncStatus]}`} />
                )}
              </div>
              <span className="text-vyr-text-muted text-sm">
                {connection.connected 
                  ? `${statusText[connection.syncStatus]} · ${lastSyncText}`
                  : "Não conectado"
                }
              </span>
            </div>
          </div>

          {/* Actions */}
          {connection.connected && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={onReconnect}
                className="flex-1 flex items-center justify-center gap-2 bg-vyr-bg-primary rounded-xl py-3 text-vyr-text-secondary transition-all active:scale-[0.98]"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-medium">Reconectar</span>
              </button>
              <button
                onClick={onDisconnect}
                className="flex-1 flex items-center justify-center gap-2 bg-vyr-status-negative/10 rounded-xl py-3 text-vyr-status-negative transition-all active:scale-[0.98]"
              >
                <Unlink className="w-4 h-4" />
                <span className="text-sm font-medium">Desconectar</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Data Section */}
      <section className="mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <h2 className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase mb-4">
          Dados
        </h2>

        <div className="bg-vyr-bg-surface rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-vyr-text-muted" />
            <div>
              <span className="text-vyr-text-primary block">
                {connection.baselineDays >= 7 
                  ? "Baseline completo"
                  : `Baseline em construção`
                }
              </span>
              <span className="text-vyr-text-muted text-sm">
                {connection.baselineDays >= 7 
                  ? "7+ dias de histórico disponível"
                  : `${connection.baselineDays}/7 dias coletados`
                }
              </span>
            </div>
          </div>

          {/* Baseline Progress */}
          {connection.baselineDays < 7 && (
            <div className="pt-2">
              <div className="h-2 bg-vyr-bg-primary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-vyr-accent-action rounded-full transition-all"
                  style={{ width: `${(connection.baselineDays / 7) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Privacy Section */}
      <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
        <h2 className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase mb-4">
          Privacidade
        </h2>

        <div className="bg-vyr-bg-surface rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-vyr-accent-action mt-0.5" />
            <p className="text-vyr-text-secondary text-sm leading-relaxed">
              Seus dados fisiológicos são processados internamente e nunca exibidos diretamente. 
              O VYR interpreta sinais para fornecer orientações cognitivas sem expor métricas brutas.
            </p>
          </div>
        </div>
      </section>

      {/* Account Section */}
      <section className="mt-8 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <h2 className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase mb-4">
          Conta
        </h2>
        <div className="bg-vyr-bg-surface rounded-2xl p-4">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 w-full text-left text-vyr-status-negative transition-all active:scale-[0.98]"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sair da conta</span>
          </button>
        </div>
      </section>

      {/* Build Info */}
      <section className="mt-10 animate-fade-in" style={{ animationDelay: "400ms" }}>
        <p className="text-vyr-text-muted/40 text-[10px] text-center font-mono tracking-wide">
          VYR v1 · build {__BUILD_SHA__.slice(0, 7)} · {__BUILD_TIME__.split("T")[0]}
        </p>
      </section>
    </div>
  );
}
