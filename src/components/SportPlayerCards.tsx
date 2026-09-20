import { GenericPlayerCard } from "./GenericPlayerCard";
import { Player, BatsmanStats, BowlerStats } from "@/types/cricket";
import { NFLPlayer, SoccerPlayer, BasketballPlayer, MLBPlayer, NHLPlayer } from "@/types/sports";

// Cricket narration and stats
const generateCricketNarration = (player: Player): string => {
  const stats = player.stats;
  if (player.role === "batsman" || player.role === "all-rounder") {
    const batsmanStats = stats as BatsmanStats;
    return `Hello, I'm ${player.name}. I've played ${batsmanStats.matchesPlayed} matches against teams including ${batsmanStats.teamsPlayedAgainst.slice(0, 3).join(", ")}. My highest score is ${batsmanStats.highestScore}, where I scored ${batsmanStats.boundaries.fours} fours and ${batsmanStats.boundaries.sixes} sixes. Here's an interesting fact: ${batsmanStats.interestingFact}`;
  } else {
    const bowlerStats = stats as BowlerStats;
    return `Hello, I'm ${player.name}. I've played ${bowlerStats.matchesPlayed} matches against teams including ${bowlerStats.teamsPlayedAgainst.slice(0, 3).join(", ")}. I've taken ${bowlerStats.wickets} wickets in ${bowlerStats.overs} overs, with an economy rate of ${bowlerStats.economyRate}. I bowled ${bowlerStats.wides} wides and I'm known for my ${bowlerStats.specialDeliveries.join(", ")}. Here's an interesting fact: ${bowlerStats.interestingFact}`;
  }
};

const renderCricketStats = (player: Player) => {
  const stats = player.stats;
  return (
    <>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-muted/50 rounded p-2">
          <div className="text-muted-foreground">Matches</div>
          <div className="font-semibold text-sm">{stats.matchesPlayed}</div>
        </div>

        {(player.role === "batsman" || player.role === "all-rounder") && (
          <>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">High Score</div>
              <div className="font-semibold text-sm">{(stats as BatsmanStats).highestScore}</div>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">Fours</div>
              <div className="font-semibold text-sm">{(stats as BatsmanStats).boundaries.fours}</div>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">Sixes</div>
              <div className="font-semibold text-sm">{(stats as BatsmanStats).boundaries.sixes}</div>
            </div>
          </>
        )}

        {player.role === "bowler" && (
          <>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">Wickets</div>
              <div className="font-semibold text-sm">{(stats as BowlerStats).wickets}</div>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">Overs</div>
              <div className="font-semibold text-sm">{(stats as BowlerStats).overs}</div>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">Economy</div>
              <div className="font-semibold text-sm">{(stats as BowlerStats).economyRate}</div>
            </div>
          </>
        )}
      </div>

      <div className="text-xs">
        <div className="text-muted-foreground mb-1 font-medium">Played Against</div>
        <div className="flex flex-wrap gap-1">
          {stats.teamsPlayedAgainst.slice(0, 5).map((team, idx) => (
            <span key={idx} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
              {team}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

// NFL narration and stats
const generateNFLNarration = (player: NFLPlayer): string => {
  return `Hello, I'm ${player.name}, ${player.position} for the ${player.team}. I've played ${player.stats.gamesPlayed} games against teams including ${player.stats.teamsPlayedAgainst.slice(0, 3).join(", ")}. I've scored ${player.stats.touchdowns} touchdowns and gained ${player.stats.yards} yards. Here's an interesting fact: ${player.stats.interestingFact}`;
};

const renderNFLStats = (player: NFLPlayer) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-muted/50 rounded p-2">
          <div className="text-muted-foreground">Games</div>
          <div className="font-semibold text-sm">{player.stats.gamesPlayed}</div>
        </div>
        <div className="bg-muted/50 rounded p-2">
          <div className="text-muted-foreground">Touchdowns</div>
          <div className="font-semibold text-sm">{player.stats.touchdowns}</div>
        </div>
        <div className="bg-muted/50 rounded p-2">
          <div className="text-muted-foreground">Yards</div>
          <div className="font-semibold text-sm">{player.stats.yards.toLocaleString()}</div>
        </div>
        {player.stats.receptions && (
          <div className="bg-muted/50 rounded p-2">
            <div className="text-muted-foreground">Receptions</div>
            <div className="font-semibold text-sm">{player.stats.receptions}</div>
          </div>
        )}
      </div>

      <div className="text-xs">
        <div className="text-muted-foreground mb-1 font-medium">Played Against</div>
        <div className="flex flex-wrap gap-1">
          {player.stats.teamsPlayedAgainst.slice(0, 5).map((team, idx) => (
            <span key={idx} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
              {team}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

// Soccer narration and stats
const generateSoccerNarration = (player: SoccerPlayer): string => {
  return `Hello, I'm ${player.name}, ${player.position} for ${player.team}. I've played ${player.stats.matchesPlayed} matches against teams including ${player.stats.teamsPlayedAgainst.slice(0, 3).join(", ")}. I've scored ${player.stats.goals} goals and provided ${player.stats.assists} assists. Here's an interesting fact: ${player.stats.interestingFact}`;
};

const renderSoccerStats = (player: SoccerPlayer) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-muted/50 rounded p-2">
          <div className="text-muted-foreground">Matches</div>
          <div className="font-semibold text-sm">{player.stats.matchesPlayed}</div>
        </div>
        <div className="bg-muted/50 rounded p-2">
          <div className="text-muted-foreground">Goals</div>
          <div className="font-semibold text-sm">{player.stats.goals}</div>
        </div>
        <div className="bg-muted/50 rounded p-2">
          <div className="text-muted-foreground">Assists</div>
          <div className="font-semibold text-sm">{player.stats.assists}</div>
        </div>
        <div className="bg-muted/50 rounded p-2">
          <div className="text-muted-foreground">Cards</div>
          <div className="font-semibold text-sm">
            <span className="text-yellow-500">Y:{player.stats.yellowCards}</span>
            {" "}
            <span className="text-red-500">R:{player.stats.redCards}</span>
          </div>
        </div>
      </div>

      <div className="text-xs">
        <div className="text-muted-foreground mb-1 font-medium">Played Against</div>
        <div className="flex flex-wrap gap-1">
          {player.stats.teamsPlayedAgainst.slice(0, 5).map((team, idx) => (
            <span key={idx} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
              {team}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

// Basketball narration and stats
const generateBasketballNarration = (player: BasketballPlayer): string => {
  return `Hello, I'm ${player.name}, ${player.position} for the ${player.team}. I've played ${player.stats.gamesPlayed} games against teams including ${player.stats.teamsPlayedAgainst.slice(0, 3).join(", ")}. I've scored ${player.stats.points} points, grabbed ${player.stats.rebounds} rebounds, and dished out ${player.stats.assists} assists. Here's an interesting fact: ${player.stats.interestingFact}`;
};

const renderBasketballStats = (player: BasketballPlayer) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-muted/50 rounded p-2">
          <div className="text-muted-foreground">Games</div>
          <div className="font-semibold text-sm">{player.stats.gamesPlayed}</div>
        </div>
        <div className="bg-muted/50 rounded p-2">
          <div className="text-muted-foreground">Points</div>
          <div className="font-semibold text-sm">{player.stats.points.toLocaleString()}</div>
        </div>
        <div className="bg-muted/50 rounded p-2">
          <div className="text-muted-foreground">Rebounds</div>
          <div className="font-semibold text-sm">{player.stats.rebounds.toLocaleString()}</div>
        </div>
        <div className="bg-muted/50 rounded p-2">
          <div className="text-muted-foreground">Assists</div>
          <div className="font-semibold text-sm">{player.stats.assists.toLocaleString()}</div>
        </div>
      </div>

      <div className="text-xs">
        <div className="text-muted-foreground mb-1 font-medium">Played Against</div>
        <div className="flex flex-wrap gap-1">
          {player.stats.teamsPlayedAgainst.slice(0, 5).map((team, idx) => (
            <span key={idx} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
              {team}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

// MLB narration and stats
const generateMLBNarration = (player: MLBPlayer): string => {
  const stats = player.stats;
  if (player.position === "pitcher") {
    return `Hello, I'm ${player.name}, pitching for the ${player.team}. I've played ${stats.gamesPlayed} games. I have an ERA of ${stats.era}, with ${stats.strikeouts} strikeouts and ${stats.wins} wins. Here's an interesting fact: ${stats.interestingFact}`;
  } else {
    return `Hello, I'm ${player.name}, playing ${player.position} for the ${player.team}. I've played ${stats.gamesPlayed} games with a batting average of ${stats.battingAverage}. I've hit ${stats.homeRuns} home runs and driven in ${stats.rbi} runs, with ${stats.stolenBases} stolen bases. Here's an interesting fact: ${stats.interestingFact}`;
  }
};

const renderMLBStats = (player: MLBPlayer) => {
  const stats = player.stats;
  return (
    <>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-muted/50 rounded p-2">
          <div className="text-muted-foreground">Games</div>
          <div className="font-semibold text-sm">{stats.gamesPlayed}</div>
        </div>

        {player.position === "pitcher" ? (
          <>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">ERA</div>
              <div className="font-semibold text-sm">{stats.era?.toFixed(2)}</div>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">Strikeouts</div>
              <div className="font-semibold text-sm">{stats.strikeouts}</div>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">Wins</div>
              <div className="font-semibold text-sm">{stats.wins}</div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">AVG</div>
              <div className="font-semibold text-sm">{stats.battingAverage?.toFixed(3)}</div>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">Home Runs</div>
              <div className="font-semibold text-sm">{stats.homeRuns}</div>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">RBI</div>
              <div className="font-semibold text-sm">{stats.rbi}</div>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">Stolen Bases</div>
              <div className="font-semibold text-sm">{stats.stolenBases}</div>
            </div>
          </>
        )}
      </div>

      <div className="text-xs">
        <div className="text-muted-foreground mb-1 font-medium">Played Against</div>
        <div className="flex flex-wrap gap-1">
          {stats.teamsPlayedAgainst.slice(0, 5).map((team, idx) => (
            <span key={idx} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
              {team}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

// NHL narration and stats
const generateNHLNarration = (player: NHLPlayer): string => {
  const stats = player.stats;
  if (player.position === "goalie") {
    return `Hello, I'm ${player.name}, goaltender for the ${player.team}. I've played ${stats.gamesPlayed} games with ${stats.wins} wins. I have a ${stats.savePercentage?.toFixed(3)} save percentage and ${stats.goalsAgainstAverage?.toFixed(2)} goals against average, with ${stats.shutouts} shutouts. Here's an interesting fact: ${stats.interestingFact}`;
  } else {
    return `Hello, I'm ${player.name}, playing ${player.position} for the ${player.team}. I've played ${stats.gamesPlayed} games, scoring ${stats.goals} goals and ${stats.assists} assists for ${stats.points} total points. My plus-minus is ${stats.plusMinus}. Here's an interesting fact: ${stats.interestingFact}`;
  }
};

const renderNHLStats = (player: NHLPlayer) => {
  const stats = player.stats;
  return (
    <>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-muted/50 rounded p-2">
          <div className="text-muted-foreground">Games</div>
          <div className="font-semibold text-sm">{stats.gamesPlayed}</div>
        </div>

        {player.position === "goalie" ? (
          <>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">Wins</div>
              <div className="font-semibold text-sm">{stats.wins}</div>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">Save %</div>
              <div className="font-semibold text-sm">{stats.savePercentage?.toFixed(3)}</div>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">GAA</div>
              <div className="font-semibold text-sm">{stats.goalsAgainstAverage?.toFixed(2)}</div>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">Shutouts</div>
              <div className="font-semibold text-sm">{stats.shutouts}</div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">Goals</div>
              <div className="font-semibold text-sm">{stats.goals}</div>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">Assists</div>
              <div className="font-semibold text-sm">{stats.assists}</div>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">Points</div>
              <div className="font-semibold text-sm">{stats.points}</div>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-muted-foreground">+/-</div>
              <div className="font-semibold text-sm">{stats.plusMinus}</div>
            </div>
          </>
        )}
      </div>

      <div className="text-xs">
        <div className="text-muted-foreground mb-1 font-medium">Played Against</div>
        <div className="flex flex-wrap gap-1">
          {stats.teamsPlayedAgainst.slice(0, 5).map((team, idx) => (
            <span key={idx} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
              {team}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

// Export wrapped components
export const CricketPlayerCard = ({ player, index }: { player: Player; index?: number }) => (
  <GenericPlayerCard
    player={player}
    generateNarration={generateCricketNarration}
    renderStats={renderCricketStats}
    sport="cricket"
    index={index}
  />
);

export const NFLPlayerCard = ({ player, index }: { player: NFLPlayer; index?: number }) => (
  <GenericPlayerCard
    player={player}
    generateNarration={generateNFLNarration}
    renderStats={renderNFLStats}
    sport="nfl"
    index={index}
  />
);

export const SoccerPlayerCard = ({ player, index }: { player: SoccerPlayer; index?: number }) => (
  <GenericPlayerCard
    player={player}
    generateNarration={generateSoccerNarration}
    renderStats={renderSoccerStats}
    sport="soccer"
    index={index}
  />
);

export const BasketballPlayerCard = ({ player, index }: { player: BasketballPlayer; index?: number }) => (
  <GenericPlayerCard
    player={player}
    generateNarration={generateBasketballNarration}
    renderStats={renderBasketballStats}
    sport="basketball"
    index={index}
  />
);

export const MLBPlayerCard = ({ player, index }: { player: MLBPlayer; index?: number }) => (
  <GenericPlayerCard
    player={player}
    generateNarration={generateMLBNarration}
    renderStats={renderMLBStats}
    sport="mlb"
    index={index}
  />
);

export const NHLPlayerCard = ({ player, index }: { player: NHLPlayer; index?: number }) => (
  <GenericPlayerCard
    player={player}
    generateNarration={generateNHLNarration}
    renderStats={renderNHLStats}
    sport="nhl"
    index={index}
  />
);
