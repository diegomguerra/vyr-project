import { ChevronLeft, Bell, CheckCheck } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NotificationsProps {
  onBack: () => void;
}

function groupByDate(notifications: any[]) {
  const groups: Record<string, any[]> = {};
  for (const n of notifications) {
    const d = new Date(n.created_at);
    const key = isToday(d) ? "Hoje" : isYesterday(d) ? "Ontem" : format(d, "dd/MM/yyyy");
    (groups[key] ??= []).push(n);
  }
  return groups;
}

export default function Notifications({ onBack }: NotificationsProps) {
  const { notifications, loading, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const grouped = groupByDate(notifications);

  return (
    <div className="min-h-screen bg-vyr-bg-primary px-5 pt-6 pb-28 safe-area-top safe-area-left safe-area-right">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-1 text-vyr-text-muted transition-opacity active:opacity-60">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Voltar</span>
        </button>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="flex items-center gap-1.5 text-vyr-accent-action text-xs font-medium">
            <CheckCheck className="w-4 h-4" />
            Marcar todas como lidas
          </button>
        )}
      </div>

      <h1 className="text-vyr-text-primary text-2xl font-semibold mb-6 animate-fade-in">Notificações</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-vyr-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <Bell className="w-10 h-10 text-vyr-text-muted/40 mx-auto" />
          <p className="text-vyr-text-muted text-sm">Nenhuma notificação ainda.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <h2 className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase mb-3">{date}</h2>
              <div className="space-y-2">
                {items.map((n: any) => (
                  <button
                    key={n.id}
                    onClick={() => !n.read && markAsRead(n.id)}
                    className={`w-full text-left bg-vyr-bg-surface rounded-xl p-4 transition-all active:scale-[0.98] ${
                      !n.read ? "border-l-2 border-vyr-accent-action" : "opacity-70"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? "bg-vyr-accent-action" : "bg-transparent"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-vyr-text-primary text-sm font-medium truncate">{n.title}</p>
                        {n.body && <p className="text-vyr-text-muted text-xs mt-1 line-clamp-2">{n.body}</p>}
                        <span className="text-vyr-text-muted/60 text-[10px] mt-1 block">
                          {format(new Date(n.created_at), "HH:mm")}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
