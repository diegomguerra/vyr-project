
-- action_logs
DROP POLICY IF EXISTS "Users manage own action_logs" ON public.action_logs;
CREATE POLICY "action_logs_select_own" ON public.action_logs FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "action_logs_insert_own" ON public.action_logs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "action_logs_update_own" ON public.action_logs FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "action_logs_delete_own" ON public.action_logs FOR DELETE TO authenticated USING (user_id = auth.uid());

-- checkpoints
DROP POLICY IF EXISTS "Users manage own checkpoints" ON public.checkpoints;
CREATE POLICY "checkpoints_select_own" ON public.checkpoints FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "checkpoints_insert_own" ON public.checkpoints FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "checkpoints_update_own" ON public.checkpoints FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "checkpoints_delete_own" ON public.checkpoints FOR DELETE TO authenticated USING (user_id = auth.uid());

-- computed_states
DROP POLICY IF EXISTS "Users manage own computed_states" ON public.computed_states;
CREATE POLICY "computed_states_select_own" ON public.computed_states FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "computed_states_insert_own" ON public.computed_states FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "computed_states_update_own" ON public.computed_states FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "computed_states_delete_own" ON public.computed_states FOR DELETE TO authenticated USING (user_id = auth.uid());

-- daily_reviews
DROP POLICY IF EXISTS "Users manage own daily_reviews" ON public.daily_reviews;
CREATE POLICY "daily_reviews_select_own" ON public.daily_reviews FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "daily_reviews_insert_own" ON public.daily_reviews FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "daily_reviews_update_own" ON public.daily_reviews FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "daily_reviews_delete_own" ON public.daily_reviews FOR DELETE TO authenticated USING (user_id = auth.uid());

-- notification_preferences
DROP POLICY IF EXISTS "Users manage own notification_preferences" ON public.notification_preferences;
CREATE POLICY "notification_preferences_select_own" ON public.notification_preferences FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notification_preferences_insert_own" ON public.notification_preferences FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "notification_preferences_update_own" ON public.notification_preferences FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notification_preferences_delete_own" ON public.notification_preferences FOR DELETE TO authenticated USING (user_id = auth.uid());

-- notifications
DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notifications_insert_own" ON public.notifications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notifications_delete_own" ON public.notifications FOR DELETE TO authenticated USING (user_id = auth.uid());

-- push_subscriptions
DROP POLICY IF EXISTS "Users manage own push_subscriptions" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_select_own" ON public.push_subscriptions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "push_subscriptions_insert_own" ON public.push_subscriptions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "push_subscriptions_update_own" ON public.push_subscriptions FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "push_subscriptions_delete_own" ON public.push_subscriptions FOR DELETE TO authenticated USING (user_id = auth.uid());

-- user_baselines
DROP POLICY IF EXISTS "Users manage own baselines" ON public.user_baselines;
CREATE POLICY "user_baselines_select_own" ON public.user_baselines FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "user_baselines_insert_own" ON public.user_baselines FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_baselines_update_own" ON public.user_baselines FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_baselines_delete_own" ON public.user_baselines FOR DELETE TO authenticated USING (user_id = auth.uid());

-- user_consents
DROP POLICY IF EXISTS "Users manage own user_consents" ON public.user_consents;
CREATE POLICY "user_consents_select_own" ON public.user_consents FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "user_consents_insert_own" ON public.user_consents FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_consents_update_own" ON public.user_consents FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_consents_delete_own" ON public.user_consents FOR DELETE TO authenticated USING (user_id = auth.uid());

-- participantes
DROP POLICY IF EXISTS "Users manage own participante" ON public.participantes;
CREATE POLICY "participantes_select_own" ON public.participantes FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "participantes_insert_own" ON public.participantes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "participantes_update_own" ON public.participantes FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "participantes_delete_own" ON public.participantes FOR DELETE TO authenticated USING (user_id = auth.uid());
