
-- Drop all RESTRICTIVE policies and recreate as explicitly PERMISSIVE
-- Also includes ring_daily_data and user_integrations which are still RESTRICTIVE

-- action_logs
DROP POLICY IF EXISTS "action_logs_select_own" ON public.action_logs;
DROP POLICY IF EXISTS "action_logs_insert_own" ON public.action_logs;
DROP POLICY IF EXISTS "action_logs_update_own" ON public.action_logs;
DROP POLICY IF EXISTS "action_logs_delete_own" ON public.action_logs;
CREATE POLICY "action_logs_select_own" ON public.action_logs AS PERMISSIVE FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "action_logs_insert_own" ON public.action_logs AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "action_logs_update_own" ON public.action_logs AS PERMISSIVE FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "action_logs_delete_own" ON public.action_logs AS PERMISSIVE FOR DELETE TO authenticated USING (user_id = auth.uid());

-- checkpoints
DROP POLICY IF EXISTS "checkpoints_select_own" ON public.checkpoints;
DROP POLICY IF EXISTS "checkpoints_insert_own" ON public.checkpoints;
DROP POLICY IF EXISTS "checkpoints_update_own" ON public.checkpoints;
DROP POLICY IF EXISTS "checkpoints_delete_own" ON public.checkpoints;
CREATE POLICY "checkpoints_select_own" ON public.checkpoints AS PERMISSIVE FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "checkpoints_insert_own" ON public.checkpoints AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "checkpoints_update_own" ON public.checkpoints AS PERMISSIVE FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "checkpoints_delete_own" ON public.checkpoints AS PERMISSIVE FOR DELETE TO authenticated USING (user_id = auth.uid());

-- computed_states
DROP POLICY IF EXISTS "computed_states_select_own" ON public.computed_states;
DROP POLICY IF EXISTS "computed_states_insert_own" ON public.computed_states;
DROP POLICY IF EXISTS "computed_states_update_own" ON public.computed_states;
DROP POLICY IF EXISTS "computed_states_delete_own" ON public.computed_states;
CREATE POLICY "computed_states_select_own" ON public.computed_states AS PERMISSIVE FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "computed_states_insert_own" ON public.computed_states AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "computed_states_update_own" ON public.computed_states AS PERMISSIVE FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "computed_states_delete_own" ON public.computed_states AS PERMISSIVE FOR DELETE TO authenticated USING (user_id = auth.uid());

-- daily_reviews
DROP POLICY IF EXISTS "daily_reviews_select_own" ON public.daily_reviews;
DROP POLICY IF EXISTS "daily_reviews_insert_own" ON public.daily_reviews;
DROP POLICY IF EXISTS "daily_reviews_update_own" ON public.daily_reviews;
DROP POLICY IF EXISTS "daily_reviews_delete_own" ON public.daily_reviews;
CREATE POLICY "daily_reviews_select_own" ON public.daily_reviews AS PERMISSIVE FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "daily_reviews_insert_own" ON public.daily_reviews AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "daily_reviews_update_own" ON public.daily_reviews AS PERMISSIVE FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "daily_reviews_delete_own" ON public.daily_reviews AS PERMISSIVE FOR DELETE TO authenticated USING (user_id = auth.uid());

-- notification_preferences
DROP POLICY IF EXISTS "notification_preferences_select_own" ON public.notification_preferences;
DROP POLICY IF EXISTS "notification_preferences_insert_own" ON public.notification_preferences;
DROP POLICY IF EXISTS "notification_preferences_update_own" ON public.notification_preferences;
DROP POLICY IF EXISTS "notification_preferences_delete_own" ON public.notification_preferences;
CREATE POLICY "notification_preferences_select_own" ON public.notification_preferences AS PERMISSIVE FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notification_preferences_insert_own" ON public.notification_preferences AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "notification_preferences_update_own" ON public.notification_preferences AS PERMISSIVE FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notification_preferences_delete_own" ON public.notification_preferences AS PERMISSIVE FOR DELETE TO authenticated USING (user_id = auth.uid());

-- notifications
DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_insert_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_delete_own" ON public.notifications;
CREATE POLICY "notifications_select_own" ON public.notifications AS PERMISSIVE FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notifications_insert_own" ON public.notifications AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "notifications_update_own" ON public.notifications AS PERMISSIVE FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notifications_delete_own" ON public.notifications AS PERMISSIVE FOR DELETE TO authenticated USING (user_id = auth.uid());

-- push_subscriptions
DROP POLICY IF EXISTS "push_subscriptions_select_own" ON public.push_subscriptions;
DROP POLICY IF EXISTS "push_subscriptions_insert_own" ON public.push_subscriptions;
DROP POLICY IF EXISTS "push_subscriptions_update_own" ON public.push_subscriptions;
DROP POLICY IF EXISTS "push_subscriptions_delete_own" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_select_own" ON public.push_subscriptions AS PERMISSIVE FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "push_subscriptions_insert_own" ON public.push_subscriptions AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "push_subscriptions_update_own" ON public.push_subscriptions AS PERMISSIVE FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "push_subscriptions_delete_own" ON public.push_subscriptions AS PERMISSIVE FOR DELETE TO authenticated USING (user_id = auth.uid());

-- user_baselines
DROP POLICY IF EXISTS "user_baselines_select_own" ON public.user_baselines;
DROP POLICY IF EXISTS "user_baselines_insert_own" ON public.user_baselines;
DROP POLICY IF EXISTS "user_baselines_update_own" ON public.user_baselines;
DROP POLICY IF EXISTS "user_baselines_delete_own" ON public.user_baselines;
CREATE POLICY "user_baselines_select_own" ON public.user_baselines AS PERMISSIVE FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "user_baselines_insert_own" ON public.user_baselines AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_baselines_update_own" ON public.user_baselines AS PERMISSIVE FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_baselines_delete_own" ON public.user_baselines AS PERMISSIVE FOR DELETE TO authenticated USING (user_id = auth.uid());

-- user_consents
DROP POLICY IF EXISTS "user_consents_select_own" ON public.user_consents;
DROP POLICY IF EXISTS "user_consents_insert_own" ON public.user_consents;
DROP POLICY IF EXISTS "user_consents_update_own" ON public.user_consents;
DROP POLICY IF EXISTS "user_consents_delete_own" ON public.user_consents;
CREATE POLICY "user_consents_select_own" ON public.user_consents AS PERMISSIVE FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "user_consents_insert_own" ON public.user_consents AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_consents_update_own" ON public.user_consents AS PERMISSIVE FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_consents_delete_own" ON public.user_consents AS PERMISSIVE FOR DELETE TO authenticated USING (user_id = auth.uid());

-- participantes
DROP POLICY IF EXISTS "participantes_select_own" ON public.participantes;
DROP POLICY IF EXISTS "participantes_insert_own" ON public.participantes;
DROP POLICY IF EXISTS "participantes_update_own" ON public.participantes;
DROP POLICY IF EXISTS "participantes_delete_own" ON public.participantes;
CREATE POLICY "participantes_select_own" ON public.participantes AS PERMISSIVE FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "participantes_insert_own" ON public.participantes AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "participantes_update_own" ON public.participantes AS PERMISSIVE FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "participantes_delete_own" ON public.participantes AS PERMISSIVE FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ring_daily_data
DROP POLICY IF EXISTS "ring_daily_data_select_own" ON public.ring_daily_data;
DROP POLICY IF EXISTS "ring_daily_data_insert_own" ON public.ring_daily_data;
DROP POLICY IF EXISTS "ring_daily_data_update_own" ON public.ring_daily_data;
DROP POLICY IF EXISTS "ring_daily_data_delete_own" ON public.ring_daily_data;
CREATE POLICY "ring_daily_data_select_own" ON public.ring_daily_data AS PERMISSIVE FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "ring_daily_data_insert_own" ON public.ring_daily_data AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "ring_daily_data_update_own" ON public.ring_daily_data AS PERMISSIVE FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "ring_daily_data_delete_own" ON public.ring_daily_data AS PERMISSIVE FOR DELETE TO authenticated USING (user_id = auth.uid());

-- user_integrations
DROP POLICY IF EXISTS "user_integrations_select_own" ON public.user_integrations;
DROP POLICY IF EXISTS "user_integrations_insert_own" ON public.user_integrations;
DROP POLICY IF EXISTS "user_integrations_update_own" ON public.user_integrations;
DROP POLICY IF EXISTS "user_integrations_delete_own" ON public.user_integrations;
CREATE POLICY "user_integrations_select_own" ON public.user_integrations AS PERMISSIVE FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "user_integrations_insert_own" ON public.user_integrations AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_integrations_update_own" ON public.user_integrations AS PERMISSIVE FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_integrations_delete_own" ON public.user_integrations AS PERMISSIVE FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
