import type { Player } from "@/types/cricket";
import type { NFLPlayer, SoccerPlayer, BasketballPlayer, MLBPlayer, NHLPlayer, Sport } from "@/types/sports";

interface CustomPlayerData {
  id: string;
  name: string;
  team: string;
  sport: Sport;
  image: string;
  stats: any;
  addedAt: string;
}

// Export function to generate stats for any sport
export function generateStatsForSport(sport: Sport, name: string) {
  switch (sport) {
    case "cricket":
      return generateCricketStatsOnly();
    case "nfl":
      return generateNFLStatsOnly();
    case "soccer":
      return generateSoccerStatsOnly();
    case "basketball":
      return generateBasketballStatsOnly();
    case "mlb":
      return generateMLBStatsOnly();
    case "nhl":
      return generateNHLStatsOnly();
    default:
      return generateCricketStatsOnly();
  }
}

// Auto-generate stats based on sport type
function generateCricketStatsOnly() {
  const isBowler = Math.random() > 0.6;
  
  return isBowler ? {
    matchesPlayed: Math.floor(Math.random() * 50) + 20,
    teamsPlayedAgainst: ["Various Teams"],
    wickets: Math.floor(Math.random() * 100) + 30,
    overs: Math.floor(Math.random() * 200) + 100,
    economyRate: parseFloat((Math.random() * 3 + 5).toFixed(2)),
    wides: Math.floor(Math.random() * 30) + 10,
    specialDeliveries: ["Yorker", "Bouncer"],
    interestingFact: "Custom player added by user.",
  } : {
    matchesPlayed: Math.floor(Math.random() * 50) + 20,
    teamsPlayedAgainst: ["Various Teams"],
    highestScore: Math.floor(Math.random() * 100) + 50,
    boundaries: {
      fours: Math.floor(Math.random() * 200) + 100,
      sixes: Math.floor(Math.random() * 100) + 50,
    },
    interestingFact: "Custom player added by user.",
  };
}

function generateCricketStats(name: string): Player {
  const isBowler = Math.random() > 0.6;
  
  return {
    id: `custom-${Date.now()}-${Math.random()}`,
    name,
    team: "Custom Team",
    role: isBowler ? "bowler" : "batsman",
    image: "",
    stats: isBowler ? {
      matchesPlayed: Math.floor(Math.random() * 50) + 20,
      teamsPlayedAgainst: ["Various Teams"],
      wickets: Math.floor(Math.random() * 100) + 30,
      overs: Math.floor(Math.random() * 200) + 100,
      economyRate: parseFloat((Math.random() * 3 + 5).toFixed(2)),
      wides: Math.floor(Math.random() * 30) + 10,
      specialDeliveries: ["Yorker", "Bouncer"],
      interestingFact: "Custom player added by user.",
    } : {
      matchesPlayed: Math.floor(Math.random() * 50) + 20,
      teamsPlayedAgainst: ["Various Teams"],
      highestScore: Math.floor(Math.random() * 100) + 50,
      boundaries: {
        fours: Math.floor(Math.random() * 200) + 100,
        sixes: Math.floor(Math.random() * 100) + 50,
      },
      interestingFact: "Custom player added by user.",
    },
  };
}

function generateNFLStatsOnly() {
  return {
    gamesPlayed: Math.floor(Math.random() * 100) + 50,
    teamsPlayedAgainst: ["Various Teams"],
    touchdowns: Math.floor(Math.random() * 50) + 10,
    yards: Math.floor(Math.random() * 5000) + 2000,
    receptions: Math.floor(Math.random() * 100) + 30,
    interestingFact: "Custom player added by user.",
  };
}

function generateNFLStats(name: string): NFLPlayer {
  const positions = ["quarterback", "running-back", "wide-receiver", "tight-end", "linebacker", "defensive-back", "defensive-line"] as const;
  
  return {
    id: `custom-${Date.now()}-${Math.random()}`,
    name,
    team: "Custom Team",
    position: positions[Math.floor(Math.random() * positions.length)],
    image: "",
    stats: generateNFLStatsOnly(),
  };
}

function generateSoccerStatsOnly() {
  return {
    matchesPlayed: Math.floor(Math.random() * 200) + 100,
    teamsPlayedAgainst: ["Various Teams"],
    goals: Math.floor(Math.random() * 100) + 20,
    assists: Math.floor(Math.random() * 80) + 15,
    yellowCards: Math.floor(Math.random() * 20) + 2,
    redCards: Math.floor(Math.random() * 3),
    interestingFact: "Custom player added by user.",
  };
}

function generateSoccerStats(name: string): SoccerPlayer {
  const positions = ["forward", "midfielder", "defender", "goalkeeper"] as const;
  
  return {
    id: `custom-${Date.now()}-${Math.random()}`,
    name,
    team: "Custom Team",
    position: positions[Math.floor(Math.random() * positions.length)],
    image: "",
    stats: generateSoccerStatsOnly(),
  };
}

function generateBasketballStatsOnly() {
  return {
    gamesPlayed: Math.floor(Math.random() * 500) + 200,
    teamsPlayedAgainst: ["Various Teams"],
    points: Math.floor(Math.random() * 10000) + 5000,
    rebounds: Math.floor(Math.random() * 3000) + 1000,
    assists: Math.floor(Math.random() * 2000) + 800,
    interestingFact: "Custom player added by user.",
  };
}

function generateBasketballStats(name: string): BasketballPlayer {
  const positions = ["point-guard", "shooting-guard", "small-forward", "power-forward", "center"] as const;
  
  return {
    id: `custom-${Date.now()}-${Math.random()}`,
    name,
    team: "Custom Team",
    position: positions[Math.floor(Math.random() * positions.length)],
    image: "",
    stats: generateBasketballStatsOnly(),
  };
}

function generateMLBStatsOnly() {
  return {
    gamesPlayed: Math.floor(Math.random() * 800) + 400,
    teamsPlayedAgainst: ["Various Teams"],
    battingAverage: parseFloat((Math.random() * 0.15 + 0.25).toFixed(3)),
    homeRuns: Math.floor(Math.random() * 200) + 50,
    rbi: Math.floor(Math.random() * 400) + 150,
    interestingFact: "Custom player added by user.",
  };
}

function generateMLBStats(name: string): MLBPlayer {
  const positions = ["pitcher", "catcher", "first-base", "second-base", "third-base", "shortstop", "outfield", "designated-hitter"] as const;
  
  return {
    id: `custom-${Date.now()}-${Math.random()}`,
    name,
    team: "Custom Team",
    position: positions[Math.floor(Math.random() * positions.length)],
    image: "",
    stats: generateMLBStatsOnly(),
  };
}

function generateNHLStatsOnly() {
  return {
    gamesPlayed: Math.floor(Math.random() * 500) + 200,
    teamsPlayedAgainst: ["Various Teams"],
    goals: Math.floor(Math.random() * 200) + 50,
    assists: Math.floor(Math.random() * 300) + 100,
    points: Math.floor(Math.random() * 500) + 150,
    interestingFact: "Custom player added by user.",
  };
}

function generateNHLStats(name: string): NHLPlayer {
  const positions = ["center", "left-wing", "right-wing", "defense", "goalie"] as const;
  
  return {
    id: `custom-${Date.now()}-${Math.random()}`,
    name,
    team: "Custom Team",
    position: positions[Math.floor(Math.random() * positions.length)],
    image: "",
    stats: generateNHLStatsOnly(),
  };
}

export function getCustomPlayers(): CustomPlayerData[] {
  const stored = localStorage.getItem("custom-players");
  return stored ? JSON.parse(stored) : [];
}

export function getCustomPlayersForSport(sport: Sport) {
  const customPlayers = getCustomPlayers().filter(p => p.sport === sport);
  
  return customPlayers.map(cp => {
    let player;
    
    // Use stored stats if available, otherwise generate new ones
    const stats = cp.stats || generateStatsForSport(sport, cp.name);
    
    switch (sport) {
      case "cricket":
        const role = stats.wickets !== undefined ? "bowler" : "batsman";
        player = {
          id: cp.id,
          name: cp.name,
          team: cp.team,
          role,
          image: cp.image,
          stats,
        };
        break;
      case "nfl":
        const nflPositions = ["quarterback", "running-back", "wide-receiver", "tight-end", "linebacker", "defensive-back", "defensive-line"] as const;
        player = {
          id: cp.id,
          name: cp.name,
          team: cp.team,
          position: nflPositions[Math.floor(Math.random() * nflPositions.length)],
          image: cp.image,
          stats,
        };
        break;
      case "soccer":
        const soccerPositions = ["forward", "midfielder", "defender", "goalkeeper"] as const;
        player = {
          id: cp.id,
          name: cp.name,
          team: cp.team,
          position: soccerPositions[Math.floor(Math.random() * soccerPositions.length)],
          image: cp.image,
          stats,
        };
        break;
      case "basketball":
        const basketballPositions = ["point-guard", "shooting-guard", "small-forward", "power-forward", "center"] as const;
        player = {
          id: cp.id,
          name: cp.name,
          team: cp.team,
          position: basketballPositions[Math.floor(Math.random() * basketballPositions.length)],
          image: cp.image,
          stats,
        };
        break;
      case "mlb":
        const mlbPositions = ["pitcher", "catcher", "first-base", "second-base", "third-base", "shortstop", "outfield", "designated-hitter"] as const;
        player = {
          id: cp.id,
          name: cp.name,
          team: cp.team,
          position: mlbPositions[Math.floor(Math.random() * mlbPositions.length)],
          image: cp.image,
          stats,
        };
        break;
      case "nhl":
        const nhlPositions = ["center", "left-wing", "right-wing", "defense", "goalie"] as const;
        player = {
          id: cp.id,
          name: cp.name,
          team: cp.team,
          position: nhlPositions[Math.floor(Math.random() * nhlPositions.length)],
          image: cp.image,
          stats,
        };
        break;
      default:
        player = {
          id: cp.id,
          name: cp.name,
          team: cp.team,
          role: "batsman",
          image: cp.image,
          stats,
        };
    }
    
    return player;
  });
}

export function deleteCustomPlayer(id: string): void {
  const customPlayers = getCustomPlayers();
  const filtered = customPlayers.filter(p => p.id !== id);
  localStorage.setItem("custom-players", JSON.stringify(filtered));
}
