import { useState, useEffect } from "react";
import { players, teams } from "@/data/players";
import { nflPlayers, nflTeams } from "@/data/nfl-players";
import { soccerPlayers, soccerTeams } from "@/data/soccer-players";
import { basketballPlayers, basketballTeams } from "@/data/basketball-players";
import { mlbPlayers, mlbTeams } from "@/data/mlb-players";
import { nhlPlayers, nhlTeams } from "@/data/nhl-players";
import { CricketPlayerCard, NFLPlayerCard, SoccerPlayerCard, BasketballPlayerCard, MLBPlayerCard, NHLPlayerCard } from "@/components/SportPlayerCards";
import { Button } from "@/components/ui/button";
import { Trophy, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sport } from "@/types/sports";
import { trackVisit, trackSportView } from "@/lib/analytics";
import { Link } from "react-router-dom";
import { AddPlayerDialog } from "@/components/AddPlayerDialog";
import { getCustomPlayersForSport } from "@/lib/customPlayers";
import { usePlayerOverrides } from "@/hooks/usePlayerOverrides";

const Index = () => {
  const [selectedSport, setSelectedSport] = useState<Sport | "quiz">("cricket");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const { applyOverrides } = usePlayerOverrides();

  // Track page visit on mount
  useEffect(() => {
    trackVisit();
  }, []);

  // Track sport view when changed
  useEffect(() => {
    if (selectedSport !== "quiz") {
      trackSportView(selectedSport);
    }
  }, [selectedSport]);

  const handlePlayerAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getCurrentTeams = () => {
    switch (selectedSport) {
      case "cricket": return teams;
      case "nfl": return nflTeams;
      case "soccer": return soccerTeams;
      case "basketball": return basketballTeams;
      case "mlb": return mlbTeams;
      case "nhl": return nhlTeams;
      case "quiz": return [];
      default: return [];
    }
  };

  const getCurrentPlayers = () => {
    if (selectedSport === "quiz") return [];
    
    let basePlayers;
    switch (selectedSport) {
      case "cricket":
        basePlayers = players;
        break;
      case "nfl":
        basePlayers = nflPlayers;
        break;
      case "soccer":
        basePlayers = soccerPlayers;
        break;
      case "basketball":
        basePlayers = basketballPlayers;
        break;
      case "mlb":
        basePlayers = mlbPlayers;
        break;
      case "nhl":
        basePlayers = nhlPlayers;
        break;
      default:
        basePlayers = [];
    }
    
    // Merge with custom players
    const customPlayers = getCustomPlayersForSport(selectedSport);
    return applyOverrides(selectedSport, [...basePlayers, ...customPlayers]);
  };

  const filteredPlayers = selectedTeam === "all" 
    ? getCurrentPlayers() 
    : getCurrentPlayers().filter((p: any) => p.team === selectedTeam);

  const renderPlayerCard = (player: any, index: number) => {
    switch (selectedSport) {
      case "cricket":
        return <CricketPlayerCard key={player.id} player={player} index={index} />;
      case "nfl":
        return <NFLPlayerCard key={player.id} player={player} index={index} />;
      case "soccer":
        return <SoccerPlayerCard key={player.id} player={player} index={index} />;
      case "basketball":
        return <BasketballPlayerCard key={player.id} player={player} index={index} />;
      case "mlb":
        return <MLBPlayerCard key={player.id} player={player} index={index} />;
      case "nhl":
        return <NHLPlayerCard key={player.id} player={player} index={index} />;
      default:
        return null;
    }
  };

  const getSportTitle = () => {
    switch (selectedSport) {
      case "cricket": return "Cricket Stats Hub";
      case "nfl": return "NFL Stats Hub";
      case "soccer": return "Soccer Stats Hub";
      case "basketball": return "NBA Stats Hub";
      case "mlb": return "MLB Stats Hub";
      case "nhl": return "NHL Stats Hub";
      case "quiz": return "Harsha Bhogle's Treasure";
      default: return "Sports Stats Hub";
    }
  };

  const sportOptions = [
    { value: "cricket" as Sport, label: "Cricket" },
    { value: "nfl" as Sport, label: "NFL" },
    { value: "soccer" as Sport, label: "Soccer" },
    { value: "basketball" as Sport, label: "Basketball" },
    { value: "mlb" as Sport, label: "Baseball" },
    { value: "nhl" as Sport, label: "Hockey" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20" key={refreshKey}>
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {getSportTitle()}
              </h1>
            </div>
            <div className="flex gap-2">
              <AddPlayerDialog 
                onPlayerAdded={handlePlayerAdded}
                availableSports={sportOptions}
                getTeamsForSport={getCurrentTeams}
              />
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Sport Tabs */}
          <Tabs value={selectedSport} onValueChange={(value) => {
            setSelectedSport(value as Sport | "quiz");
            setSelectedTeam("all");
          }} className="mb-4">
            <TabsList className="bg-muted">
              <TabsTrigger value="cricket">Cricket</TabsTrigger>
              <TabsTrigger value="nfl">NFL</TabsTrigger>
              <TabsTrigger value="soccer">Soccer</TabsTrigger>
              <TabsTrigger value="basketball">Basketball</TabsTrigger>
              <TabsTrigger value="mlb">MLB</TabsTrigger>
              <TabsTrigger value="nhl">NHL</TabsTrigger>
              <TabsTrigger value="quiz">Quiz Master</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Team Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedTeam("all")}
              variant={selectedTeam === "all" ? "default" : "outline"}
              size="sm"
            >
              All Teams
            </Button>
            {getCurrentTeams().map((team) => (
              <Button
                key={team}
                onClick={() => setSelectedTeam(team)}
                variant={selectedTeam === team ? "default" : "outline"}
                size="sm"
              >
                {team}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {selectedSport === "quiz" ? (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Harsha Bhogle's Treasure
            </h2>
            <p className="text-muted-foreground">
              Quiz content coming soon...
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                {selectedTeam === "all" ? "All Players" : `${selectedTeam} Players`}
              </h2>
              <p className="text-muted-foreground mt-1">
                Click on a card to view stats, then hear them narrated
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlayers.map((player: any, index: number) => renderPlayerCard(player, index))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
