
-- Drop the restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Users own ring_daily_data" ON public.ring_daily_data;

CREATE POLICY "Users can manage own ring_daily_data"
ON public.ring_daily_data
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
