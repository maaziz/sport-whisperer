import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Wand2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Sport } from "@/types/sports";
import { generateStatsForSport } from "@/lib/customPlayers";

interface AddPlayerDialogProps {
  onPlayerAdded: () => void;
  availableSports: { value: Sport; label: string }[];
  getTeamsForSport: (sport: Sport) => string[];
}

export function AddPlayerDialog({ onPlayerAdded, availableSports, getTeamsForSport }: AddPlayerDialogProps) {
  const [open, setOpen] = useState(false);
  const [sport, setSport] = useState<Sport>("cricket");
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [customStats, setCustomStats] = useState<any>(null);

  // Generate stats when sport changes
  useEffect(() => {
    const stats = generateStatsForSport(sport, name || "Player");
    setCustomStats(stats);
  }, [sport]);

  const handleRegenerateStats = () => {
    const stats = generateStatsForSport(sport, name || "Player");
    setCustomStats(stats);
    toast({
      title: "Stats Regenerated",
      description: "New random stats have been generated.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !team.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newPlayer = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      team: team.trim(),
      sport,
      image: imageUrl.trim() || "https://images.unsplash.com/photo-1511367461989-f85a21fda167",
      stats: customStats,
      addedAt: new Date().toISOString(),
    };

    // Get existing custom players
    const existing = localStorage.getItem("custom-players");
    const customPlayers = existing ? JSON.parse(existing) : [];
    
    // Add new player
    customPlayers.push(newPlayer);
    localStorage.setItem("custom-players", JSON.stringify(customPlayers));

    toast({
      title: "Player Added",
      description: `${name} has been added to ${team}!`,
    });

    // Reset form
    setName("");
    setTeam("");
    setImageUrl("");
    setCustomStats(null);
    setOpen(false);
    
    onPlayerAdded();
  };

  const updateStat = (key: string, value: any) => {
    setCustomStats((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateNestedStat = (parentKey: string, childKey: string, value: any) => {
    setCustomStats((prev: any) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value,
      },
    }));
  };

  const renderStatFields = () => {
    if (!customStats) return null;

    switch (sport) {
      case "cricket":
        return customStats.wickets !== undefined ? (
          // Bowler stats
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="matchesPlayed">Matches Played</Label>
                <Input
                  id="matchesPlayed"
                  type="number"
                  value={customStats.matchesPlayed}
                  onChange={(e) => updateStat("matchesPlayed", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="wickets">Wickets</Label>
                <Input
                  id="wickets"
                  type="number"
                  value={customStats.wickets}
                  onChange={(e) => updateStat("wickets", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="overs">Overs</Label>
                <Input
                  id="overs"
                  type="number"
                  value={customStats.overs}
                  onChange={(e) => updateStat("overs", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="economyRate">Economy Rate</Label>
                <Input
                  id="economyRate"
                  type="number"
                  step="0.01"
                  value={customStats.economyRate}
                  onChange={(e) => updateStat("economyRate", parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="wides">Wides</Label>
                <Input
                  id="wides"
                  type="number"
                  value={customStats.wides}
                  onChange={(e) => updateStat("wides", parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        ) : (
          // Batsman stats
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="matchesPlayed">Matches Played</Label>
                <Input
                  id="matchesPlayed"
                  type="number"
                  value={customStats.matchesPlayed}
                  onChange={(e) => updateStat("matchesPlayed", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="highestScore">Highest Score</Label>
                <Input
                  id="highestScore"
                  type="number"
                  value={customStats.highestScore}
                  onChange={(e) => updateStat("highestScore", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="fours">Fours</Label>
                <Input
                  id="fours"
                  type="number"
                  value={customStats.boundaries?.fours}
                  onChange={(e) => updateNestedStat("boundaries", "fours", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="sixes">Sixes</Label>
                <Input
                  id="sixes"
                  type="number"
                  value={customStats.boundaries?.sixes}
                  onChange={(e) => updateNestedStat("boundaries", "sixes", parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        );

      case "nfl":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="gamesPlayed">Games Played</Label>
                <Input
                  id="gamesPlayed"
                  type="number"
                  value={customStats.gamesPlayed}
                  onChange={(e) => updateStat("gamesPlayed", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="touchdowns">Touchdowns</Label>
                <Input
                  id="touchdowns"
                  type="number"
                  value={customStats.touchdowns}
                  onChange={(e) => updateStat("touchdowns", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="yards">Yards</Label>
                <Input
                  id="yards"
                  type="number"
                  value={customStats.yards}
                  onChange={(e) => updateStat("yards", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="receptions">Receptions</Label>
                <Input
                  id="receptions"
                  type="number"
                  value={customStats.receptions || 0}
                  onChange={(e) => updateStat("receptions", parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        );

      case "soccer":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="matchesPlayed">Matches Played</Label>
                <Input
                  id="matchesPlayed"
                  type="number"
                  value={customStats.matchesPlayed}
                  onChange={(e) => updateStat("matchesPlayed", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="goals">Goals</Label>
                <Input
                  id="goals"
                  type="number"
                  value={customStats.goals}
                  onChange={(e) => updateStat("goals", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="assists">Assists</Label>
                <Input
                  id="assists"
                  type="number"
                  value={customStats.assists}
                  onChange={(e) => updateStat("assists", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="yellowCards">Yellow Cards</Label>
                <Input
                  id="yellowCards"
                  type="number"
                  value={customStats.yellowCards}
                  onChange={(e) => updateStat("yellowCards", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="redCards">Red Cards</Label>
                <Input
                  id="redCards"
                  type="number"
                  value={customStats.redCards}
                  onChange={(e) => updateStat("redCards", parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        );

      case "basketball":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="gamesPlayed">Games Played</Label>
                <Input
                  id="gamesPlayed"
                  type="number"
                  value={customStats.gamesPlayed}
                  onChange={(e) => updateStat("gamesPlayed", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={customStats.points}
                  onChange={(e) => updateStat("points", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="rebounds">Rebounds</Label>
                <Input
                  id="rebounds"
                  type="number"
                  value={customStats.rebounds}
                  onChange={(e) => updateStat("rebounds", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="assists">Assists</Label>
                <Input
                  id="assists"
                  type="number"
                  value={customStats.assists}
                  onChange={(e) => updateStat("assists", parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        );

      case "mlb":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="gamesPlayed">Games Played</Label>
                <Input
                  id="gamesPlayed"
                  type="number"
                  value={customStats.gamesPlayed}
                  onChange={(e) => updateStat("gamesPlayed", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="battingAverage">Batting Average</Label>
                <Input
                  id="battingAverage"
                  type="number"
                  step="0.001"
                  value={customStats.battingAverage || 0}
                  onChange={(e) => updateStat("battingAverage", parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="homeRuns">Home Runs</Label>
                <Input
                  id="homeRuns"
                  type="number"
                  value={customStats.homeRuns || 0}
                  onChange={(e) => updateStat("homeRuns", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="rbi">RBI</Label>
                <Input
                  id="rbi"
                  type="number"
                  value={customStats.rbi || 0}
                  onChange={(e) => updateStat("rbi", parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        );

      case "nhl":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="gamesPlayed">Games Played</Label>
                <Input
                  id="gamesPlayed"
                  type="number"
                  value={customStats.gamesPlayed}
                  onChange={(e) => updateStat("gamesPlayed", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="goals">Goals</Label>
                <Input
                  id="goals"
                  type="number"
                  value={customStats.goals || 0}
                  onChange={(e) => updateStat("goals", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="assists">Assists</Label>
                <Input
                  id="assists"
                  type="number"
                  value={customStats.assists || 0}
                  onChange={(e) => updateStat("assists", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={customStats.points || 0}
                  onChange={(e) => updateStat("points", parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Player
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Player</DialogTitle>
            <DialogDescription>
              Add a custom player with customizable stats for any sport and team.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid gap-2">
                  <Label htmlFor="sport">Sport *</Label>
                  <Select value={sport} onValueChange={(value) => setSport(value as Sport)}>
                    <SelectTrigger id="sport">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSports.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="team">Team *</Label>
                  <Select value={team} onValueChange={setTeam}>
                    <SelectTrigger id="team">
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {getTeamsForSport(sport).map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="name">Player Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter player name"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image">Image URL (optional)</Label>
                  <Input
                    id="image"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/player.jpg"
                  />
                </div>
              </TabsContent>

              <TabsContent value="stats" className="space-y-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">
                    Customize player statistics or regenerate random values
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerateStats}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
                {renderStatFields()}
              </TabsContent>
            </Tabs>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Player</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
