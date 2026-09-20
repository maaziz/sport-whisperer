// Shared read-only data access for the MCP server.
// All data here is static, intentionally public sports statistics.
import { players, teams } from "../../data/players";
import { nflPlayers, nflTeams } from "../../data/nfl-players";
import { soccerPlayers, soccerTeams } from "../../data/soccer-players";
import { basketballPlayers, basketballTeams } from "../../data/basketball-players";
import { mlbPlayers, mlbTeams } from "../../data/mlb-players";
import { nhlPlayers, nhlTeams } from "../../data/nhl-players";

export const SPORTS = ["cricket", "nfl", "soccer", "basketball", "mlb", "nhl"] as const;
export type SportKey = (typeof SPORTS)[number];

type Entry = { label: string; players: any[]; teams: string[] };

export const SPORT_DATA: Record<SportKey, Entry> = {
  cricket: { label: "Cricket", players, teams },
  nfl: { label: "NFL (American Football)", players: nflPlayers, teams: nflTeams },
  soccer: { label: "Soccer (Football)", players: soccerPlayers, teams: soccerTeams },
  basketball: { label: "Basketball (NBA)", players: basketballPlayers, teams: basketballTeams },
  mlb: { label: "Baseball (MLB)", players: mlbPlayers, teams: mlbTeams },
  nhl: { label: "Ice Hockey (NHL)", players: nhlPlayers, teams: nhlTeams },
};

export function allPlayers(): { sport: SportKey; player: any }[] {
  return SPORTS.flatMap((sport) =>
    SPORT_DATA[sport].players.map((player) => ({ sport, player })),
  );
}
