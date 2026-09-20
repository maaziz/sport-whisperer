import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { allPlayers } from "../data";

export default defineTool({
  name: "search_players",
  title: "Search players",
  description:
    "Search all sports for players by name, team, or role/position. Returns matching players with their sport.",
  inputSchema: {
    query: z.string().trim().min(1).describe("Free-text search over player name, team and role."),
    limit: z.number().int().min(1).max(50).optional().describe("Max results (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, limit }: { query: string; limit?: number }) => {
    const q = query.toLowerCase();
    const results = allPlayers()
      .filter(({ player }) =>
        [player.name, player.team, player.role ?? player.position ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .slice(0, limit ?? 20)
      .map(({ sport, player }) => ({
        sport,
        id: player.id,
        name: player.name,
        team: player.team,
        role: player.role ?? player.position ?? null,
      }));
    return {
      content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }],
      structuredContent: { query, results },
    };
  },
});
