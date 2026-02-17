
-- Fix ring_daily_data: drop RESTRICTIVE policy, create PERMISSIVE
DROP POLICY IF EXISTS "Users manage own ring_daily_data" ON public.ring_daily_data;
CREATE POLICY "Users manage own ring_daily_data"
  ON public.ring_daily_data
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Fix user_integrations: drop RESTRICTIVE policy, create PERMISSIVE
DROP POLICY IF EXISTS "Users manage own user_integrations" ON public.user_integrations;
CREATE POLICY "Users manage own user_integrations"
  ON public.user_integrations
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
