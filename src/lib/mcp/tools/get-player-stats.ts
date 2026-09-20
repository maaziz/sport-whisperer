import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { allPlayers } from "../data";

export default defineTool({
  name: "get_player_stats",
  title: "Get player stats",
  description:
    "Get the full stat sheet for one player by id (e.g. virat-kohli) or by name. Searches every sport.",
  inputSchema: {
    query: z.string().trim().min(1).describe("Player id or player name."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query }: { query: string }) => {
    const q = query.toLowerCase();
    const entries = allPlayers();
    const match =
      entries.find((e) => e.player.id.toLowerCase() === q) ??
      entries.find((e) => e.player.name.toLowerCase() === q) ??
      entries.find((e) => e.player.name.toLowerCase().includes(q));
    if (!match) throw new ToolError(`No player found matching "${query}".`);
    const { sport, player } = match;
    const result = {
      sport,
      id: player.id,
      name: player.name,
      team: player.team,
      role: player.role ?? player.position ?? null,
      stats: player.stats,
    };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
