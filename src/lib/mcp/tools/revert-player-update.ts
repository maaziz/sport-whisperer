import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SPORTS } from "../data";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "revert_player_update",
  title: "Revert player update",
  description:
    "Remove a previously applied update for one player, restoring the built-in stat sheet, team and portrait.",
  inputSchema: {
    sport: z.enum(SPORTS).describe("Sport the player belongs to."),
    player_id: z.string().trim().min(1).describe("Player id, e.g. virat-kohli."),
  },
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ sport, player_id }) => {
    const supabase = supabaseAnon();
    const { data, error } = await supabase
      .from("player_overrides")
      .delete()
      .eq("sport", sport)
      .eq("player_id", player_id)
      .select("player_id");
    if (error) throw new ToolError(error.message);
    const removed = (data ?? []).length > 0;
    return {
      content: [
        {
          type: "text" as const,
          text: removed
            ? `Reverted ${player_id} (${sport}) to the built-in data.`
            : `No stored update found for ${player_id} (${sport}).`,
        },
      ],
      structuredContent: { reverted: removed, sport, player_id },
    };
  },
});
