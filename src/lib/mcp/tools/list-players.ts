import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SPORTS, SPORT_DATA, type SportKey } from "../data";

export default defineTool({
  name: "list_players",
  title: "List players",
  description:
    "List players for a sport, optionally filtered by team. Returns id, name, team and role/position.",
  inputSchema: {
    sport: z.enum(SPORTS).describe("Sport key, e.g. cricket, nfl, soccer, basketball, mlb, nhl."),
    team: z.string().trim().min(1).optional().describe("Optional exact team name to filter by."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ sport, team }: { sport: SportKey; team?: string }) => {
    const entry = SPORT_DATA[sport];
    if (team && !entry.teams.some((t) => t.toLowerCase() === team.toLowerCase())) {
      throw new ToolError(
        `Unknown team "${team}" for ${entry.label}. Available: ${entry.teams.join(", ")}`,
      );
    }
    const list = entry.players
      .filter((p) => !team || p.team.toLowerCase() === team.toLowerCase())
      .map((p) => ({
        id: p.id,
        name: p.name,
        team: p.team,
        role: p.role ?? p.position ?? null,
      }));
    return {
      content: [{ type: "text" as const, text: JSON.stringify(list, null, 2) }],
      structuredContent: { sport, players: list },
    };
  },
});
