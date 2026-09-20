import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PlayerOverride = {
  sport: string;
  player_id: string;
  name: string | null;
  team: string | null;
  image: string | null;
  stats: Record<string, unknown> | null;
};

/** Fetches stored player updates and applies them on top of the built-in data. */
export function usePlayerOverrides() {
  const [overrides, setOverrides] = useState<Record<string, PlayerOverride>>({});

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("player_overrides")
        .select("sport, player_id, name, team, image, stats");
      if (!active || error || !data) return;
      const map: Record<string, PlayerOverride> = {};
      for (const row of data as PlayerOverride[]) {
        map[`${row.sport}:${row.player_id}`] = row;
      }
      setOverrides(map);
    })();
    return () => {
      active = false;
    };
  }, []);

  const applyOverrides = (sport: string, list: any[]) =>
    list.map((player) => {
      const override = overrides[`${sport}:${player.id}`];
      if (!override) return player;
      return {
        ...player,
        name: override.name ?? player.name,
        team: override.team ?? player.team,
        image: override.image ?? player.image,
        stats: { ...(player.stats ?? {}), ...(override.stats ?? {}) },
      };
    });

  return { applyOverrides };
}
