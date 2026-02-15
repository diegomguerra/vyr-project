// VYR Labs - Settings Page

import { ChevronLeft, Watch, RefreshCw, Unlink, Shield, Database, LogOut, User, Bell, ChevronRight, Plug } from "lucide-react";
import { signOut } from "@/hooks/use-auth";
import { Switch } from "@/components/ui/switch";
import { useNotificationPreferences } from "@/hooks/use-notifications";
import type { WearableConnection, WearableProvider } from "@/lib/vyr-types";

interface SettingsProps {
  connection: WearableConnection;
  onBack: () => void;
  onReconnect: () => void;
  onDisconnect: () => void;
  onGoProfile: () => void;
  onGoNotifications: () => void;
  onGoIntegrations: () => void;
}

const PROVIDER_NAMES: Record<WearableProvider, string> = {
  apple_health: "Apple Watch", garmin: "Garmin", whoop: "Whoop", fitbit: "Fitbit",
  samsung: "Samsung Galaxy Watch", xiaomi: "Xiaomi Mi Band", polar: "Polar",
  huawei: "Huawei Watch", amazfit: "Amazfit", google_fit: "Google Fit",
  oura: "Oura Ring", ringconn: "RingConn", ultrahuman: "Ultrahuman Ring",
  circular: "Circular Ring", movano: "Movano Evie", jstyle: "J-Style Ring", qring: "QRing",
};

function formatLastSync(date: Date | null): string {
  if (!date) return "Nunca sincronizado";
  const diffHours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
  if (diffHours < 1) return "há menos de 1 hora";
  if (diffHours < 24) return `há ${diffHours} horas`;
  return "há mais de 24 horas";
}

export default function Settings({ connection, onBack, onReconnect, onDisconnect, onGoProfile, onGoNotifications, onGoIntegrations }: SettingsProps) {
  const providerName = connection.provider ? PROVIDER_NAMES[connection.provider] : "Nenhum";
  const lastSyncText = formatLastSync(connection.lastSync);
  const { prefs, updatePref } = useNotificationPreferences();

  const statusText = { synced: "Conectado", pending: "Sincronização pendente", error: "Erro de conexão" };
  const statusColor = { synced: "bg-vyr-status-positive", pending: "bg-vyr-status-caution", error: "bg-vyr-status-negative" };

  return (
    <div className="min-h-screen bg-vyr-bg-primary px-5 pt-6 pb-28 safe-area-top safe-area-left safe-area-right">
      <button onClick={onBack} className="flex items-center gap-1 text-vyr-text-muted mb-6 transition-opacity active:opacity-60">
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Voltar</span>
      </button>

      <h1 className="text-vyr-text-primary text-2xl font-semibold mb-8 animate-fade-in">Configurações</h1>

      {/* Profile Link */}
      <section className="mb-8 animate-fade-in">
        <h2 className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase mb-4">Perfil</h2>
        <button onClick={onGoProfile} className="w-full bg-vyr-bg-surface rounded-2xl p-4 flex items-center gap-3 transition-all active:scale-[0.98]">
          <div className="w-10 h-10 rounded-xl bg-vyr-bg-primary flex items-center justify-center">
            <User className="w-5 h-5 text-vyr-accent-action" />
          </div>
          <div className="flex-1 text-left">
            <span className="text-vyr-text-primary font-medium block">Meu Perfil</span>
            <span className="text-vyr-text-muted text-sm">Editar dados e foto</span>
          </div>
          <ChevronRight className="w-5 h-5 text-vyr-text-muted" />
        </button>
      </section>

      {/* Notifications Preferences */}
      <section className="mb-8 animate-fade-in" style={{ animationDelay: "50ms" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase">Notificações</h2>
          <button onClick={onGoNotifications} className="text-vyr-accent-action text-xs font-medium flex items-center gap-1">
            Ver todas <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="bg-vyr-bg-surface rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-vyr-text-muted" />
              <span className="text-vyr-text-primary text-sm">Push notifications</span>
            </div>
            <Switch checked={prefs.push_enabled} onCheckedChange={(v) => updatePref("push_enabled", v)} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-vyr-text-secondary text-sm pl-8">Insights cognitivos</span>
            <Switch checked={prefs.insights_enabled} onCheckedChange={(v) => updatePref("insights_enabled", v)} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-vyr-text-secondary text-sm pl-8">Lembretes de sachets</span>
            <Switch checked={prefs.reminders_enabled} onCheckedChange={(v) => updatePref("reminders_enabled", v)} />
          </div>
        </div>
      </section>

      {/* Integrations Link */}
      <section className="mb-8 animate-fade-in" style={{ animationDelay: "80ms" }}>
        <h2 className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase mb-4">Integrações</h2>
        <button onClick={onGoIntegrations} className="w-full bg-vyr-bg-surface rounded-2xl p-4 flex items-center gap-3 transition-all active:scale-[0.98]">
          <div className="w-10 h-10 rounded-xl bg-vyr-bg-primary flex items-center justify-center">
            <Plug className="w-5 h-5 text-vyr-accent-action" />
          </div>
          <div className="flex-1 text-left">
            <span className="text-vyr-text-primary font-medium block">Dispositivos</span>
            <span className="text-vyr-text-muted text-sm">
              {connection.connected ? `${connection.provider === "apple_health" ? "Apple Health" : "Wearable"} conectado` : "Nenhum conectado"}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-vyr-text-muted" />
        </button>
      </section>

      {/* Wearable Section */}
      <section className="mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <h2 className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase mb-4">Wearable</h2>
        <div className="bg-vyr-bg-surface rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vyr-bg-primary flex items-center justify-center">
              <Watch className="w-5 h-5 text-vyr-accent-action" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-vyr-text-primary font-medium">{providerName}</span>
                {connection.connected && <span className={`w-2 h-2 rounded-full ${statusColor[connection.syncStatus]}`} />}
              </div>
              <span className="text-vyr-text-muted text-sm">
                {connection.connected ? `${statusText[connection.syncStatus]} · ${lastSyncText}` : "Não conectado"}
              </span>
            </div>
          </div>
          {connection.connected && (
            <div className="flex gap-3 pt-2">
              <button onClick={onReconnect} className="flex-1 flex items-center justify-center gap-2 bg-vyr-bg-primary rounded-xl py-3 text-vyr-text-secondary transition-all active:scale-[0.98]">
                <RefreshCw className="w-4 h-4" /><span className="text-sm font-medium">Reconectar</span>
              </button>
              <button onClick={onDisconnect} className="flex-1 flex items-center justify-center gap-2 bg-vyr-status-negative/10 rounded-xl py-3 text-vyr-status-negative transition-all active:scale-[0.98]">
                <Unlink className="w-4 h-4" /><span className="text-sm font-medium">Desconectar</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Data Section */}
      <section className="mb-8 animate-fade-in" style={{ animationDelay: "150ms" }}>
        <h2 className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase mb-4">Dados</h2>
        <div className="bg-vyr-bg-surface rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-vyr-text-muted" />
            <div>
              <span className="text-vyr-text-primary block">{connection.baselineDays >= 7 ? "Baseline completo" : "Baseline em construção"}</span>
              <span className="text-vyr-text-muted text-sm">{connection.baselineDays >= 7 ? "7+ dias de histórico disponível" : `${connection.baselineDays}/7 dias coletados`}</span>
            </div>
          </div>
          {connection.baselineDays < 7 && (
            <div className="pt-2">
              <div className="h-2 bg-vyr-bg-primary rounded-full overflow-hidden">
                <div className="h-full bg-vyr-accent-action rounded-full transition-all" style={{ width: `${(connection.baselineDays / 7) * 100}%` }} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Privacy */}
      <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
        <h2 className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase mb-4">Privacidade</h2>
        <div className="bg-vyr-bg-surface rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-vyr-accent-action mt-0.5" />
            <p className="text-vyr-text-secondary text-sm leading-relaxed">
              Seus dados fisiológicos são processados internamente e nunca exibidos diretamente. O VYR interpreta sinais para fornecer orientações cognitivas sem expor métricas brutas.
            </p>
          </div>
        </div>
      </section>

      {/* Account */}
      <section className="mt-8 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <h2 className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase mb-4">Conta</h2>
        <div className="bg-vyr-bg-surface rounded-2xl p-4">
          <button onClick={() => signOut()} className="flex items-center gap-3 w-full text-left text-vyr-status-negative transition-all active:scale-[0.98]">
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
