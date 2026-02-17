
-- Drop the existing RESTRICTIVE policy
DROP POLICY IF EXISTS "Users manage own ring_daily_data" ON public.ring_daily_data;

-- Recreate as PERMISSIVE (AS clause must come before USING/WITH CHECK)
CREATE POLICY "Users manage own ring_daily_data"
ON public.ring_daily_data
AS PERMISSIVE
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
