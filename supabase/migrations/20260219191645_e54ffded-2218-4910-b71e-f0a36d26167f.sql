
-- Drop existing RESTRICTIVE policies on user_integrations
DROP POLICY IF EXISTS user_integrations_delete_own ON public.user_integrations;
DROP POLICY IF EXISTS user_integrations_insert_own ON public.user_integrations;
DROP POLICY IF EXISTS user_integrations_select_own ON public.user_integrations;
DROP POLICY IF EXISTS user_integrations_update_own ON public.user_integrations;

-- Recreate as PERMISSIVE (default)
CREATE POLICY user_integrations_select_own
  ON public.user_integrations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY user_integrations_insert_own
  ON public.user_integrations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY user_integrations_update_own
  ON public.user_integrations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY user_integrations_delete_own
  ON public.user_integrations FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
