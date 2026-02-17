
-- Fix ALL restrictive policies to be permissive

-- user_integrations
DROP POLICY IF EXISTS "Users own user_integrations" ON public.user_integrations;
CREATE POLICY "Users manage own user_integrations"
ON public.user_integrations FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- action_logs
DROP POLICY IF EXISTS "Users own action_logs" ON public.action_logs;
CREATE POLICY "Users manage own action_logs"
ON public.action_logs FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- checkpoints
DROP POLICY IF EXISTS "Users own checkpoints" ON public.checkpoints;
CREATE POLICY "Users manage own checkpoints"
ON public.checkpoints FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- computed_states
DROP POLICY IF EXISTS "Users own computed_states" ON public.computed_states;
CREATE POLICY "Users manage own computed_states"
ON public.computed_states FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- daily_reviews
DROP POLICY IF EXISTS "Users own daily_reviews" ON public.daily_reviews;
CREATE POLICY "Users manage own daily_reviews"
ON public.daily_reviews FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- notification_preferences
DROP POLICY IF EXISTS "Users own notification_preferences" ON public.notification_preferences;
CREATE POLICY "Users manage own notification_preferences"
ON public.notification_preferences FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- notifications
DROP POLICY IF EXISTS "Users own notifications" ON public.notifications;
CREATE POLICY "Users manage own notifications"
ON public.notifications FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- push_subscriptions
DROP POLICY IF EXISTS "Users own push_subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users manage own push_subscriptions"
ON public.push_subscriptions FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- user_baselines
DROP POLICY IF EXISTS "Users own baselines" ON public.user_baselines;
CREATE POLICY "Users manage own baselines"
ON public.user_baselines FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- user_consents
DROP POLICY IF EXISTS "Users own user_consents" ON public.user_consents;
CREATE POLICY "Users manage own user_consents"
ON public.user_consents FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- participantes (has separate policies)
DROP POLICY IF EXISTS "Users can insert own participante" ON public.participantes;
DROP POLICY IF EXISTS "Users can read own participante" ON public.participantes;
DROP POLICY IF EXISTS "Users can update own participante" ON public.participantes;
CREATE POLICY "Users manage own participante"
ON public.participantes FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ring_daily_data (fix again to ensure permissive)
DROP POLICY IF EXISTS "Users can manage own ring_daily_data" ON public.ring_daily_data;
CREATE POLICY "Users manage own ring_daily_data"
ON public.ring_daily_data FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
