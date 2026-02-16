// VYR Labs - Integrations Page

import { useState } from "react";
import { ChevronLeft, Heart, Activity, Moon, Footprints, Dumbbell, Check, Info, Loader2 } from "lucide-react";
import type { WearableConnection, WearableProvider } from "@/lib/vyr-types";
import { connectAppleHealth, disconnectAppleHealth, syncHealthKitData } from "@/lib/healthkit-sync";
import { isHealthKitAvailable } from "@/lib/healthkit";
import { toast } from "sonner";

interface IntegrationsProps {
  connection: WearableConnection;
  onBack: () => void;
  onConnectAppleHealth: () => void;
  onDisconnectAppleHealth: () => void;
  onSelectProvider: (provider: WearableProvider) => void;
}

interface HealthDataType {
  id: string;
  label: string;
  icon: React.ReactNode;
  authorized: boolean;
}

const HEALTH_DATA_TYPES: HealthDataType[] = [
  { id: "heart_rate", label: "Frequência cardíaca", icon: <Heart className="w-4 h-4" />, authorized: true },
  { id: "hrv", label: "HRV", icon: <Activity className="w-4 h-4" />, authorized: true },
  { id: "sleep", label: "Sono", icon: <Moon className="w-4 h-4" />, authorized: true },
  { id: "steps", label: "Passos", icon: <Footprints className="w-4 h-4" />, authorized: true },
  { id: "workouts", label: "Treinos", icon: <Dumbbell className="w-4 h-4" />, authorized: true },
];

function formatLastSync(date: Date | null): string {
  if (!date) return "Nunca sincronizado";
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  if (sameDay) return `hoje às ${hours}:${minutes}`;
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")} às ${hours}:${minutes}`;
}

export default function Integrations({
  connection,
  onBack,
  onConnectAppleHealth,
  onDisconnectAppleHealth,
  onSelectProvider,
}: IntegrationsProps) {
  const [loading, setLoading] = useState(false);
  const isAppleHealthConnected = connection.connected && connection.provider === "apple_health";
  const isJStyleConnected = connection.connected && connection.provider === "jstyle";

  const handleConnect = async () => {
    setLoading(true);
    try {
      const available = await isHealthKitAvailable();
      if (!available) {
        toast.info("HealthKit disponível apenas no dispositivo iOS.");
        return;
      }
      const result = await connectAppleHealth();
      if (result.success) {
        onConnectAppleHealth();
        toast.success("Apple Health conectado com sucesso!");
      } else {
        toast.error(result.error ?? "Erro ao conectar Apple Health.");
      }
    } catch {
      toast.error("Erro inesperado ao conectar.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await disconnectAppleHealth();
      onDisconnectAppleHealth();
      toast.success("Apple Health desconectado.");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setLoading(true);
    try {
      const result = await syncHealthKitData();
      if (result.success) {
        toast.success(result.metricsWritten ? "Dados sincronizados!" : "Nenhum dado novo disponível.");
      } else {
        toast.error(result.error ?? "Erro na sincronização.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vyr-bg-primary px-5 pt-6 pb-28 safe-area-top safe-area-left safe-area-right">
      <button onClick={onBack} className="flex items-center gap-1 text-vyr-text-muted mb-6 transition-opacity active:opacity-60">
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Voltar</span>
      </button>

      <h1 className="text-vyr-text-primary text-2xl font-semibold mb-2 animate-fade-in">Integrações</h1>
      <p className="text-vyr-text-muted text-sm mb-8 animate-fade-in">Conecte seus dispositivos para alimentar o motor cognitivo.</p>

      {/* Apple Health Card */}
      <section className="mb-6 animate-fade-in" style={{ animationDelay: "50ms" }}>
        <div className="bg-vyr-bg-surface rounded-2xl overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              {/* Apple Health icon */}
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-vyr-text-primary font-semibold">Apple Health</span>
                  {isAppleHealthConnected && (
                    <span className="px-2 py-0.5 rounded-full bg-vyr-status-positive/20 text-vyr-status-positive text-[10px] font-medium">
                      Conectado
                    </span>
                  )}
                </div>
                <span className="text-vyr-text-muted text-sm">
                  {isAppleHealthConnected
                    ? `Última sincronização: ${formatLastSync(connection.lastSync)}`
                    : "Não conectado"}
                </span>
              </div>
            </div>

            {/* Connected state */}
            {isAppleHealthConnected ? (
              <>
                {/* Authorized data types */}
                <div className="mb-4">
                  <span className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase block mb-2">
                    Dados autorizados
                  </span>
                  <div className="space-y-2">
                    {HEALTH_DATA_TYPES.map((dt) => (
                      <div key={dt.id} className="flex items-center gap-2.5 py-1.5">
                        <div className="text-vyr-text-muted">{dt.icon}</div>
                        <span className="text-vyr-text-secondary text-sm flex-1">{dt.label}</span>
                        <Check className="w-4 h-4 text-vyr-status-positive" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSync}
                    disabled={loading}
                    className="flex-1 bg-vyr-bg-primary rounded-xl py-3 text-vyr-text-secondary text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Sincronizar agora
                  </button>
                  <button
                    onClick={handleDisconnect}
                    disabled={loading}
                    className="flex-1 bg-vyr-status-negative/10 rounded-xl py-3 text-vyr-status-negative text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    Desconectar
                  </button>
                </div>
              </>
            ) : (
              /* Disconnected state */
              <button
                onClick={handleConnect}
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-500/30 rounded-xl py-3 text-vyr-text-primary text-sm font-medium transition-all active:scale-[0.98] hover:from-pink-500/30 hover:to-red-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Conectar Apple Health
              </button>
            )}
          </div>
        </div>
      </section>

      {/* J-Style Ring Card */}
      <section className="mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="bg-vyr-bg-surface rounded-2xl overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-vyr-text-muted/20 to-vyr-text-muted/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-vyr-text-secondary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-vyr-text-primary font-semibold">J-Style Ring</span>
                  {isJStyleConnected && (
                    <span className="px-2 py-0.5 rounded-full bg-vyr-status-positive/20 text-vyr-status-positive text-[10px] font-medium">
                      Conectado
                    </span>
                  )}
                </div>
                <span className="text-vyr-text-muted text-sm">
                  {isJStyleConnected
                    ? `Última sincronização: ${formatLastSync(connection.lastSync)}`
                    : "Não conectado"}
                </span>
              </div>
            </div>

            {isJStyleConnected ? (
              <div className="flex gap-3">
                <button
                  onClick={() => onSelectProvider("jstyle")}
                  className="flex-1 bg-vyr-bg-primary rounded-xl py-3 text-vyr-text-secondary text-sm font-medium transition-all active:scale-[0.98]"
                >
                  Gerenciar
                </button>
                <button
                  onClick={() => onSelectProvider("jstyle")}
                  className="flex-1 bg-vyr-status-negative/10 rounded-xl py-3 text-vyr-status-negative text-sm font-medium transition-all active:scale-[0.98]"
                >
                  Desconectar
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSelectProvider("jstyle")}
                className="w-full bg-vyr-bg-primary border border-vyr-stroke-divider rounded-xl py-3 text-vyr-text-primary text-sm font-medium transition-all active:scale-[0.98] hover:bg-vyr-bg-surface"
              >
                Conectar J-Style Ring
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Info note */}
      <section className="animate-fade-in" style={{ animationDelay: "150ms" }}>
        <div className="bg-vyr-bg-surface/50 rounded-2xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-vyr-text-muted shrink-0 mt-0.5" />
          <div>
            <span className="text-vyr-text-secondary text-sm font-medium block mb-1">Outros wearables</span>
            <span className="text-vyr-text-muted text-sm leading-relaxed">
              Garmin, Whoop, Oura, Fitbit e demais dispositivos compatíveis serão integrados automaticamente via Apple Health.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
