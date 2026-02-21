
-- Fix: Set view to use invoker security (not definer)
ALTER VIEW public.user_integrations_safe SET (security_invoker = on);
