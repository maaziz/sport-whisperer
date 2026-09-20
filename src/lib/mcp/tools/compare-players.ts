import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SPORTS, SPORT_DATA, allPlayers, type SportKey } from "../data";

export default defineTool({
  name: "compare_players",
  title: "Compare players",
  description:
    "Compare the stat sheets of two or more players from the same sport, side by side.",
  inputSchema: {
    sport: z.enum(SPORTS).describe("Sport the players belong to."),
    players: z
      .array(z.string().trim().min(1))
      .min(2)
      .max(5)
      .describe("Two to five player ids or names from that sport."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ sport, players }: { sport: SportKey; players: string[] }) => {
    const pool = allPlayers().filter((e) => e.sport === sport);
    const resolved = players.map((query) => {
      const q = query.toLowerCase();
      const match =
        pool.find((e) => e.player.id.toLowerCase() === q) ??
        pool.find((e) => e.player.name.toLowerCase() === q) ??
        pool.find((e) => e.player.name.toLowerCase().includes(q));
      if (!match) {
        throw new ToolError(`No ${SPORT_DATA[sport].label} player found matching "${query}".`);
      }
      const { player } = match;
      return {
        id: player.id,
        name: player.name,
        team: player.team,
        role: player.role ?? player.position ?? null,
        stats: player.stats,
      };
    });
    return {
      content: [{ type: "text" as const, text: JSON.stringify(resolved, null, 2) }],
      structuredContent: { sport, players: resolved },
    };
  },
});
