import { defineMcp } from "@lovable.dev/mcp-js";
import listSportsTool from "./tools/list-sports";
import listPlayersTool from "./tools/list-players";
import searchPlayersTool from "./tools/search-players";
import getPlayerStatsTool from "./tools/get-player-stats";
import comparePlayersTool from "./tools/compare-players";
import updatePlayerStatsTool from "./tools/update-player-stats";
import listPlayerUpdatesTool from "./tools/list-player-updates";
import revertPlayerUpdateTool from "./tools/revert-player-update";

export default defineMcp({
  name: "sports-stats-whisperer",
  title: "sports-stats-whisperer",
  version: "0.2.0",
  instructions:
    "A curated multi-sport statistics library covering cricket, NFL, soccer, basketball, MLB and NHL. Read with `list_sports`, `list_players`, `search_players`, `get_player_stats` and `compare_players`. Keep it current with `update_player_stats` (merges changed stat fields, team, portrait or corrected name for one player and applies them across the app), `list_player_updates` (what has already been refreshed, newest first) and `revert_player_update` (restore the built-in values). Only submit figures from authoritative sources and pass that source in the `source` field.",
  tools: [
    listSportsTool,
    listPlayersTool,
    searchPlayersTool,
    getPlayerStatsTool,
    comparePlayersTool,
    updatePlayerStatsTool,
    listPlayerUpdatesTool,
    revertPlayerUpdateTool,
  ],
});
