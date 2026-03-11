-- Fix legacy table naming to ensure PostgREST exposes /rest/v1/classifications
DO $$
BEGIN
  IF to_regclass('public.classification') IS NOT NULL
     AND to_regclass('public.classifications') IS NULL THEN
    ALTER TABLE public.classification RENAME TO classifications;
  END IF;
END
$$;
