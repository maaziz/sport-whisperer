// Generic sports player types
export type Sport = "cricket" | "nfl" | "soccer" | "basketball" | "mlb" | "nhl";

// NFL Types
export interface NFLPlayer {
  id: string;
  name: string;
  team: string;
  position: "quarterback" | "running-back" | "wide-receiver" | "tight-end" | "linebacker" | "defensive-back" | "defensive-line";
  image: string;
  stats: NFLStats;
}

export interface NFLStats {
  gamesPlayed: number;
  teamsPlayedAgainst: string[];
  touchdowns: number;
  yards: number;
  receptions?: number;
  tackles?: number;
  sacks?: number;
  interestingFact: string;
  careerTimeline?: { 
    year: string; 
    touchdowns: number; 
    yards: number; 
    games: number;
    milestone?: string;
  }[];
}

// Soccer Types
export interface SoccerPlayer {
  id: string;
  name: string;
  team: string;
  position: "forward" | "midfielder" | "defender" | "goalkeeper";
  image: string;
  stats: SoccerStats;
}

export interface SoccerStats {
  matchesPlayed: number;
  teamsPlayedAgainst: string[];
  goals: number;
  assists: number;
  cleanSheets?: number;
  saves?: number;
  yellowCards: number;
  redCards: number;
  interestingFact: string;
  careerTimeline?: { 
    year: string; 
    goals: number; 
    assists: number; 
    matches: number;
    milestone?: string;
  }[];
}

// Basketball Types
export interface BasketballPlayer {
  id: string;
  name: string;
  team: string;
  position: "point-guard" | "shooting-guard" | "small-forward" | "power-forward" | "center";
  image: string;
  stats: BasketballStats;
}

export interface BasketballStats {
  gamesPlayed: number;
  teamsPlayedAgainst: string[];
  points: number;
  rebounds: number;
  assists: number;
  blocks?: number;
  steals?: number;
  interestingFact: string;
  careerTimeline?: { 
    year: string; 
    points: number; 
    rebounds: number; 
    assists: number;
    milestone?: string;
  }[];
}

// MLB Types
export interface MLBPlayer {
  id: string;
  name: string;
  team: string;
  position: "pitcher" | "catcher" | "first-base" | "second-base" | "third-base" | "shortstop" | "outfield" | "designated-hitter";
  image: string;
  stats: MLBStats;
}

export interface MLBStats {
  gamesPlayed: number;
  teamsPlayedAgainst: string[];
  battingAverage?: number;
  homeRuns?: number;
  rbi?: number;
  stolenBases?: number;
  era?: number;
  strikeouts?: number;
  wins?: number;
  interestingFact: string;
  careerTimeline?: { 
    year: string; 
    homeRuns?: number; 
    rbi?: number; 
    battingAverage?: number;
    era?: number;
    strikeouts?: number;
    milestone?: string;
  }[];
}

// NHL Types
export interface NHLPlayer {
  id: string;
  name: string;
  team: string;
  position: "center" | "left-wing" | "right-wing" | "defense" | "goalie";
  image: string;
  stats: NHLStats;
}

export interface NHLStats {
  gamesPlayed: number;
  teamsPlayedAgainst: string[];
  goals?: number;
  assists?: number;
  points?: number;
  plusMinus?: number;
  wins?: number;
  savePercentage?: number;
  goalsAgainstAverage?: number;
  shutouts?: number;
  interestingFact: string;
  careerTimeline?: { 
    year: string; 
    goals?: number; 
    assists?: number; 
    points?: number;
    wins?: number;
    milestone?: string;
  }[];
}

// Union type for all players
export type AnyPlayer = NFLPlayer | SoccerPlayer | BasketballPlayer | MLBPlayer | NHLPlayer | import("@/types/cricket").Player;
