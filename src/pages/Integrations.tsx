// VYR Labs - Integrations Page

import { useState, useCallback } from "react";
import { ChevronLeft, Heart, Activity, Moon, Footprints, Dumbbell, Check, ChevronRight } from "lucide-react";
import type { WearableConnection, WearableProvider } from "@/lib/vyr-types";

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

const OTHER_PROVIDERS: { id: WearableProvider; name: string }[] = [
  { id: "garmin", name: "Garmin" },
  { id: "whoop", name: "Whoop" },
  { id: "fitbit", name: "Fitbit" },
  { id: "samsung", name: "Samsung Galaxy Watch" },
  { id: "oura", name: "Oura Ring" },
  { id: "ringconn", name: "RingConn" },
  { id: "ultrahuman", name: "Ultrahuman Ring" },
  { id: "polar", name: "Polar" },
  { id: "xiaomi", name: "Xiaomi Mi Band" },
  { id: "huawei", name: "Huawei Watch" },
  { id: "amazfit", name: "Amazfit" },
  { id: "google_fit", name: "Google Fit" },
  { id: "circular", name: "Circular Ring" },
  { id: "movano", name: "Movano Evie" },
  { id: "jstyle", name: "J-Style Ring" },
  { id: "qring", name: "QRing" },
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
  const isAppleHealthConnected = connection.connected && connection.provider === "apple_health";
  const isOtherConnected = connection.connected && connection.provider !== "apple_health";

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
                    onClick={onConnectAppleHealth}
                    className="flex-1 bg-vyr-bg-primary rounded-xl py-3 text-vyr-text-secondary text-sm font-medium transition-all active:scale-[0.98]"
                  >
                    Gerenciar permissões
                  </button>
                  <button
                    onClick={onDisconnectAppleHealth}
                    className="flex-1 bg-vyr-status-negative/10 rounded-xl py-3 text-vyr-status-negative text-sm font-medium transition-all active:scale-[0.98]"
                  >
                    Desconectar
                  </button>
                </div>
              </>
            ) : (
              /* Disconnected state */
              <button
                onClick={onConnectAppleHealth}
                className="w-full bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-500/30 rounded-xl py-3 text-vyr-text-primary text-sm font-medium transition-all active:scale-[0.98] hover:from-pink-500/30 hover:to-red-500/30"
              >
                Conectar Apple Health
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Other providers */}
      <section className="animate-fade-in" style={{ animationDelay: "100ms" }}>
        <h2 className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase mb-4">Outros dispositivos</h2>
        <div className="bg-vyr-bg-surface rounded-2xl divide-y divide-vyr-stroke-divider">
          {OTHER_PROVIDERS.map((provider) => {
            const isConnected = isOtherConnected && connection.provider === provider.id;
            return (
              <button
                key={provider.id}
                onClick={() => onSelectProvider(provider.id)}
                className="w-full flex items-center gap-3 p-4 transition-all active:scale-[0.98] active:bg-vyr-bg-primary/50"
              >
                <div className="w-10 h-10 rounded-xl bg-vyr-bg-primary flex items-center justify-center">
                  <Activity className="w-5 h-5 text-vyr-text-muted" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-vyr-text-primary font-medium block">{provider.name}</span>
                  <span className="text-vyr-text-muted text-sm">
                    {isConnected ? "Conectado" : "Não conectado"}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-vyr-text-muted" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
