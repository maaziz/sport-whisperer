CREATE TABLE public.player_overrides (
  sport TEXT NOT NULL,
  player_id TEXT NOT NULL,
  name TEXT,
  team TEXT,
  image TEXT,
  stats JSONB,
  source TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (sport, player_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.player_overrides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.player_overrides TO authenticated;
GRANT ALL ON public.player_overrides TO service_role;

ALTER TABLE public.player_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read player overrides"
ON public.player_overrides FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert player overrides"
ON public.player_overrides FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update player overrides"
ON public.player_overrides FOR UPDATE
USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete player overrides"
ON public.player_overrides FOR DELETE
USING (true);