// avoid stale auth in iOS WKWebView; ensure valid session before DB writes
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { requireValidUserId, retryOnAuthError } from "@/lib/auth-session";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  type: string;
  read: boolean;
  created_at: string;
}

export interface NotificationPreferences {
  push_enabled: boolean;
  insights_enabled: boolean;
  reminders_enabled: boolean;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) {
      setNotifications(data as Notification[]);
      setUnreadCount(data.filter((n: any) => !n.read).length);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    // avoid stale auth in iOS WKWebView; ensure valid session before DB writes
    const userId = await requireValidUserId();
    if (!userId) return;
    await retryOnAuthError(() => supabase.from("notifications").update({ read: true } as any).eq("id", id).eq("user_id", userId));
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    // avoid stale auth in iOS WKWebView; ensure valid session before DB writes
    const userId = await requireValidUserId();
    if (!userId) return;
    await supabase
      .from("notifications")
      .update({ read: true } as any)
      .eq("user_id", userId)
      .eq("read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead, refetch: fetchNotifications };
}

export function useNotificationPreferences() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    push_enabled: true,
    insights_enabled: true,
    reminders_enabled: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setPrefs({
            push_enabled: (data as any).push_enabled,
            insights_enabled: (data as any).insights_enabled,
            reminders_enabled: (data as any).reminders_enabled,
          });
        }
        setLoading(false);
      });
  }, [user]);

  const updatePref = useCallback(
    async (key: keyof NotificationPreferences, value: boolean) => {
      // avoid stale auth in iOS WKWebView; ensure valid session before DB writes
      const userId = await requireValidUserId();
      if (!userId) return;

      setPrefs((p) => ({ ...p, [key]: value }));

      const { data } = await supabase
        .from("notification_preferences")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (data) {
        await supabase
          .from("notification_preferences")
          .update({ [key]: value } as any)
          .eq("user_id", userId);
      } else {
        // avoid stale auth in iOS WKWebView; ensure valid session before DB writes
        await supabase
          .from("notification_preferences")
          .insert({ user_id: userId, [key]: value } as any);
      }
    },
    []
  );

  return { prefs, loading, updatePref };
}
