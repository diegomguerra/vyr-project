// VYR Labs - Connection Status Component
// Indicador sutil de conexão com wearable

import { useState, useRef, useEffect } from "react";
import { Watch, AlertCircle, CheckCircle2, Clock, Heart, X } from "lucide-react";
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
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  if (!connection.connected || !connection.provider) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu((v) => !v)}
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

        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-vyr-bg-surface border border-vyr-stroke-divider rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in">
            {/* Apple Health option */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" fill="white" />
                </div>
                <div>
                  <span className="text-vyr-text-primary font-semibold block text-sm">Apple Health</span>
                  <span className="text-vyr-text-muted text-xs">Não conectado</span>
                </div>
              </div>
              <button
                onClick={() => { setShowMenu(false); onTap?.(); }}
                className="w-full bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-500/30 rounded-xl py-2.5 text-vyr-text-primary text-sm font-medium transition-all active:scale-[0.98] hover:from-pink-500/30 hover:to-red-500/30"
              >
                Conectar Apple Health
              </button>
            </div>
          </div>
        )}
      </div>
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
