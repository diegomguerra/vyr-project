DROP POLICY IF EXISTS "Users manage own ring_daily_data" ON public.ring_daily_data;

CREATE POLICY "Users manage own ring_daily_data"
  ON public.ring_daily_data
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());