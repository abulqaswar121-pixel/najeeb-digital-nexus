CREATE TABLE public.app_records (
  collection text NOT NULL,
  id text NOT NULL,
  position double precision NOT NULL DEFAULT 0,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (collection, id)
);
CREATE INDEX app_records_collection_position_idx ON public.app_records (collection, position);
GRANT ALL ON public.app_records TO service_role;
ALTER TABLE public.app_records ENABLE ROW LEVEL SECURITY;
-- No policies: only the trusted server (service role) may read or write.