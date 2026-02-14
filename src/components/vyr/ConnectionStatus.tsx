// VYR Labs - Connection Status Component
// Indicador sutil de conexão com wearable

import { Watch, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import type { WearableConnection, WearableProvider } from "@/lib/vyr-types";

interface ConnectionStatusProps {
  connection: WearableConnection;
  onTap?: () => void;
}

const PROVIDER_SHORT_NAMES: Record<WearableProvider, string> = {
  // Relógios
  apple_health: "Apple Watch",
  garmin: "Garmin",
  whoop: "Whoop",
  fitbit: "Fitbit",
  samsung: "Samsung",
  xiaomi: "Mi Band",
  polar: "Polar",
  huawei: "Huawei",
  amazfit: "Amazfit",
  google_fit: "Google Fit",
  // Smart Rings
  oura: "Oura",
  ringconn: "RingConn",
  ultrahuman: "Ultrahuman",
  circular: "Circular",
  movano: "Movano",
  jstyle: "J-Style",
  qring: "QRing",
};

function formatLastSync(date: Date | null): string {
  if (!date) return "Nunca sincronizado";
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 5) return "Agora";
  if (diffMinutes < 60) return `há ${diffMinutes} min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  return "há mais de 24h";
}

export default function ConnectionStatus({ connection, onTap }: ConnectionStatusProps) {
  if (!connection.connected || !connection.provider) {
    return (
      <button
        onClick={onTap}
        className="flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-full px-3.5 py-1.5 transition-all active:opacity-80 animate-pulse-slow"
      >
        <div className="relative">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </div>
        <span className="text-red-400 text-xs font-semibold tracking-wide">
          Sem wearable
        </span>
      </button>
    );
  }

  const providerName = PROVIDER_SHORT_NAMES[connection.provider];
  const lastSyncText = formatLastSync(connection.lastSync);

  const statusConfig = {
    synced: {
      icon: CheckCircle2,
      color: "text-vyr-status-positive",
      bgColor: "bg-vyr-status-positive/10",
    },
    pending: {
      icon: Clock,
      color: "text-vyr-status-caution",
      bgColor: "bg-vyr-status-caution/10",
    },
    error: {
      icon: AlertCircle,
      color: "text-vyr-status-negative",
      bgColor: "bg-vyr-status-negative/10",
    },
  };

  const config = statusConfig[connection.syncStatus];
  const Icon = config.icon;

  return (
    <button
      onClick={onTap}
      className={`flex items-center gap-2 ${config.bgColor} rounded-full px-3 py-1.5 transition-opacity active:opacity-80`}
    >
      <Icon className={`w-4 h-4 ${config.color}`} />
      <span className="text-vyr-text-secondary text-xs">
        {providerName}
      </span>
      <span className="text-vyr-text-muted text-xs">
        · {lastSyncText}
      </span>
    </button>
  );
}
