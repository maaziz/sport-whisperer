export interface Player {
  id: string;
  name: string;
  team: string;
  role: "batsman" | "bowler" | "all-rounder";
  image: string;
  stats: BatsmanStats | BowlerStats;
}

export interface BatsmanStats {
  matchesPlayed: number;
  teamsPlayedAgainst: string[];
  highestScore: number;
  boundaries: {
    fours: number;
    sixes: number;
  };
  interestingFact: string;
  careerTimeline?: { 
    year: string; 
    runs: number; 
    average: number; 
    strikeRate: number;
    milestone?: string;
  }[];
}

export interface BowlerStats {
  matchesPlayed: number;
  teamsPlayedAgainst: string[];
  wickets: number;
  overs: number;
  economyRate: number;
  wides: number;
  specialDeliveries: string[];
  interestingFact: string;
  careerTimeline?: { 
    year: string; 
    wickets: number; 
    average: number; 
    economyRate: number;
    milestone?: string;
  }[];
}
