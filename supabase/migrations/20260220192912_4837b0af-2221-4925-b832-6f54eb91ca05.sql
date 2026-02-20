ALTER TABLE public.user_integrations
  ADD CONSTRAINT user_integrations_user_id_provider_key
  UNIQUE (user_id, provider);

ALTER TABLE public.ring_daily_data
  ADD CONSTRAINT ring_daily_data_user_id_day_source_key
  UNIQUE (user_id, day, source_provider);