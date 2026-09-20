---
name: sports-stats-mcp
description: How an agent uses this app's public MCP endpoint to read the latest player stats and keep the in-app data files current across all six sports.
---

# Sports Stats Whisperer — MCP data freshness skill

Use this skill when asked to refresh, verify, or sync player data (stats, teams, portraits) for this app.

## MCP endpoint

The app publishes a public, read-only MCP server. The exact endpoint URL is in the Lovable editor under **More → Agent integrations** (it is the `/mcp` function of the published app, https://sport-stat-whisperer.lovable.app). Never paste Supabase project IDs or internal URLs into chat or code.

Connect with any MCP client over Streamable HTTP. For raw HTTP calls, POST JSON-RPC with both headers:

```
Accept: application/json, text/event-stream
Content-Type: application/json
```

## Available tools (all read-only)

| Tool | Use |
| --- | --- |
| `list_sports` | Coverage check: sports, teams, player counts |
| `list_players` | Roster for a sport, optionally filtered by team |
| `search_players` | Free-text lookup across all sports |
| `get_player_stats` | Full stat sheet for one player (id or name) |
| `compare_players` | Side-by-side stat sheets, 2–5 players, same sport |

## Refresh workflow

1. **Baseline** — call `list_sports` to confirm what the server currently serves; it mirrors `src/data/*-players.ts`.
2. **Fetch latest external data** — from authoritative sources only (ESPN APIs, Pro-Football-Reference, Basketball-Reference, Baseball-Reference, Hockey-Reference, Transfermarkt, ICC). Never fabricate numbers.
3. **Diff** — compare external data against `get_player_stats` output per player: team changes, season-end stat totals, retired/free-agent status.
4. **Edit data files** — apply changes to `src/data/players.ts`, `nfl-players.ts`, `soccer-players.ts`, `basketball-players.ts`, `mlb-players.ts`, `nhl-players.ts`. Keep the existing TypeScript interfaces (`src/types/sports.ts`, `src/types/cricket.ts`) and the `interestingFact` and `careerTimeline` fields intact.
5. **Portraits** — use only direct Wikimedia Commons URLs, cropped face-forward. No placeholders. Verify each URL renders before inserting.
6. **Constraints** — minimum 4 players per team; app data stays client-side (static data + localStorage); do not add backend storage for player data.
7. **Validate** — the MCP function re-bundles on build, so the endpoint reflects edits after the next publish. Re-run `get_player_stats` on a few edited players after publish to confirm.

## Rate limits

ESPN search/stats endpoints rate-limit aggressively. Batch with a small concurrency pool (~4–8), retry with backoff, and split runs across multiple commands if needed (600s command ceiling).
