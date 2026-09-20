import { defineTool } from "@lovable.dev/mcp-js";
import { SPORTS, SPORT_DATA } from "../data";

export default defineTool({
  name: "list_sports",
  title: "List sports",
  description:
    "List every sport covered by this app, with its team names and how many players are available.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const sports = SPORTS.map((key) => ({
      sport: key,
      label: SPORT_DATA[key].label,
      playerCount: SPORT_DATA[key].players.length,
      teams: SPORT_DATA[key].teams,
    }));
    return {
      content: [{ type: "text" as const, text: JSON.stringify(sports, null, 2) }],
      structuredContent: { sports },
    };
  },
});
