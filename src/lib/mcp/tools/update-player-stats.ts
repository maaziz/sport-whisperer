import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SPORTS, allPlayers } from "../data";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "update_player_stats",
  title: "Update player stats",
  description:
    "Update a player's stats, current team, portrait or display name. Stat fields are merged into the player's existing stat sheet, so you can send only the fields that changed. The update is stored as an override and immediately replaces the built-in values everywhere in the app.",
  inputSchema: {
    player: z.string().trim().min(1).describe("Player id (e.g. virat-kohli) or full player name."),
    sport: z
      .enum(SPORTS)
      .optional()
      .describe("Optional sport hint, useful when the same name exists in several sports."),
    stats: z
      .record(z.string(), z.unknown())
      .optional()
      .describe("Stat fields to change, using the same field names the read tools return."),
    team: z.string().trim().min(1).optional().describe("New current team or club."),
    name: z.string().trim().min(1).optional().describe("Corrected display name."),
    image: z.string().url().optional().describe("Portrait image URL (Wikimedia Commons, face-forward crop)."),
    source: z
      .string()
      .trim()
      .min(1)
      .optional()
      .describe("Where the new numbers came from, e.g. 'Baseball-Reference, 2025 season end'."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ player, sport, stats, team, name, image, source }) => {
    if (!stats && !team && !name && !image) {
      throw new ToolError("Provide at least one of: stats, team, name, image.");
    }

    const q = player.toLowerCase();
    const pool = allPlayers().filter((e) => !sport || e.sport === sport);
    const match =
      pool.find((e) => e.player.id.toLowerCase() === q) ??
      pool.find((e) => e.player.name.toLowerCase() === q) ??
      pool.find((e) => e.player.name.toLowerCase().includes(q));
    if (!match) throw new ToolError(`No player found matching "${player}".`);

    const supabase = supabaseAnon();
    const { data: existing, error: readError } = await supabase
      .from("player_overrides")
      .select("name, team, image, stats")
      .eq("sport", match.sport)
      .eq("player_id", match.player.id)
      .maybeSingle();
    if (readError) throw new ToolError(readError.message);

    const currentStats = {
      ...(match.player.stats ?? {}),
      ...((existing?.stats as Record<string, unknown> | null) ?? {}),
    };
    const mergedStats = stats ? { ...currentStats, ...stats } : currentStats;

    const row = {
      sport: match.sport,
      player_id: match.player.id,
      name: name ?? existing?.name ?? null,
      team: team ?? existing?.team ?? null,
      image: image ?? existing?.image ?? null,
      stats: mergedStats,
      source: source ?? null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("player_overrides")
      .upsert(row, { onConflict: "sport,player_id" });
    if (error) throw new ToolError(error.message);

    const result = {
      sport: match.sport,
      id: match.player.id,
      name: row.name ?? match.player.name,
      team: row.team ?? match.player.team,
      image: row.image ?? match.player.image ?? null,
      stats: mergedStats,
      source: row.source,
      updated_at: row.updated_at,
    };
    return {
      content: [
        {
          type: "text" as const,
          text: `Updated ${result.name} (${result.sport}).\n${JSON.stringify(result, null, 2)}`,
        },
      ],
      structuredContent: { player: result },
    };
  },
});
