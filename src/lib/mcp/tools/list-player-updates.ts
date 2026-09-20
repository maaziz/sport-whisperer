import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SPORTS } from "../data";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_player_updates",
  title: "List player updates",
  description:
    "List the stat updates that have been applied on top of the built-in data, newest first. Use it to see what has already been refreshed and when.",
  inputSchema: {
    sport: z.enum(SPORTS).optional().describe("Limit to one sport."),
    limit: z.number().int().min(1).max(200).default(50).describe("Maximum rows to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ sport, limit }) => {
    const supabase = supabaseAnon();
    let query = supabase
      .from("player_overrides")
      .select("sport, player_id, name, team, image, stats, source, updated_at")
      .order("updated_at", { ascending: false })
      .limit(limit ?? 50);
    if (sport) query = query.eq("sport", sport);

    const { data, error } = await query;
    if (error) throw new ToolError(error.message);

    const updates = (data ?? []).map((row) => ({
      sport: row.sport,
      id: row.player_id,
      name: row.name,
      team: row.team,
      image: row.image,
      stats: row.stats,
      source: row.source,
      updated_at: row.updated_at,
    }));
    return {
      content: [{ type: "text" as const, text: JSON.stringify(updates, null, 2) }],
      structuredContent: { count: updates.length, updates },
    };
  },
});
