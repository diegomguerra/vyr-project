
-- Fix: Prevent token exposure via RLS column-level security
-- Create a secure view that excludes sensitive token columns
CREATE OR REPLACE VIEW public.user_integrations_safe AS
SELECT
  id,
  user_id,
  provider,
  status,
  last_sync_at,
  last_error,
  external_user_id,
  scopes,
  meta,
  created_at,
  updated_at,
  token_expires_at
FROM public.user_integrations;

-- Grant access to the view for authenticated users
GRANT SELECT ON public.user_integrations_safe TO authenticated;

-- Revoke direct SELECT on sensitive columns from anon/authenticated
-- We keep the existing RLS policies but add a security barrier
-- by revoking column-level SELECT on token columns
REVOKE SELECT (access_token, refresh_token) ON public.user_integrations FROM anon;
REVOKE SELECT (access_token, refresh_token) ON public.user_integrations FROM authenticated;
