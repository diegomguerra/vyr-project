
-- Fix function search path for set_user_id_from_auth
CREATE OR REPLACE FUNCTION public.set_user_id_from_auth()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
begin
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;
  return new;
end;
$function$;
