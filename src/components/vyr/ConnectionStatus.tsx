// VYR Labs - Connection Status Component
// Indicador sutil de conexão com wearable

import { Watch, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import type { WearableConnection, WearableProvider } from "@/lib/vyr-types";

interface ConnectionStatusProps {
  connection: WearableConnection;
  onTap?: () => void;
}

const PROVIDER_SHORT_NAMES: Record<WearableProvider, string> = {
  apple_health: "Apple Watch",
  garmin: "Garmin",
  oura: "Oura",
  samsung: "Samsung",
  whoop: "Whoop",
  google_fit: "Google Fit",
  fitbit: "Fitbit",
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
        className="flex items-center gap-2 bg-vyr-accent-negative/10 rounded-full px-3 py-1.5 transition-opacity active:opacity-80"
      >
        <AlertCircle className="w-4 h-4 text-vyr-accent-negative" />
        <span className="text-vyr-accent-negative text-xs font-medium">
          Wearable não conectado
        </span>
      </button>
    );
  }

  const providerName = PROVIDER_SHORT_NAMES[connection.provider];
  const lastSyncText = formatLastSync(connection.lastSync);

  const statusConfig = {
    synced: {
      icon: CheckCircle2,
      color: "text-vyr-accent-positive",
      bgColor: "bg-vyr-accent-positive/10",
      dot: "🟢",
    },
    pending: {
      icon: Clock,
      color: "text-vyr-accent-caution",
      bgColor: "bg-vyr-accent-caution/10",
      dot: "🟡",
    },
    error: {
      icon: AlertCircle,
      color: "text-vyr-accent-negative",
      bgColor: "bg-vyr-accent-negative/10",
      dot: "🔴",
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
