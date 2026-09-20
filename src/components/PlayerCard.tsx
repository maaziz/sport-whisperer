import { Player, BatsmanStats, BowlerStats } from "@/types/cricket";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { textToSpeech, VOICE_OPTIONS } from "@/lib/elevenlabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlayerCardProps {
  player: Player;
}

const generateBatsmanNarration = (name: string, stats: BatsmanStats): string => {
  return `Hello, I'm ${name}. I've played ${stats.matchesPlayed} matches against teams including ${stats.teamsPlayedAgainst.slice(0, 3).join(", ")}. My highest score is ${stats.highestScore}, where I scored ${stats.boundaries.fours} fours and ${stats.boundaries.sixes} sixes. Here's an interesting fact: ${stats.interestingFact}`;
};

const generateBowlerNarration = (name: string, stats: BowlerStats): string => {
  return `Hello, I'm ${name}. I've played ${stats.matchesPlayed} matches against teams including ${stats.teamsPlayedAgainst.slice(0, 3).join(", ")}. I've taken ${stats.wickets} wickets in ${stats.overs} overs, with an economy rate of ${stats.economyRate}. I bowled ${stats.wides} wides and I'm known for my ${stats.specialDeliveries.join(", ")}. Here's an interesting fact: ${stats.interestingFact}`;
};

export const PlayerCard = ({ player }: PlayerCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(VOICE_OPTIONS[0].id);
  const [isFlipped, setIsFlipped] = useState(false);
  const { toast } = useToast();

  const handleVoicePlay = async () => {
    if (isLoading || isPlaying) return;
    
    const narration = player.role === "batsman" || player.role === "all-rounder"
      ? generateBatsmanNarration(player.name, player.stats as BatsmanStats)
      : generateBowlerNarration(player.name, player.stats as BowlerStats);

    setIsLoading(true);
    
    try {
      setIsPlaying(true);
      await textToSpeech(narration, selectedVoice);
      
      toast({
        title: "Playback Complete",
        description: `Finished playing ${player.name}'s stats`,
      });
    } catch (error) {
      toast({
        title: "Voice Playback Failed",
        description: "Unable to play audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  const stats = player.stats as BatsmanStats | BowlerStats;

  return (
    <div 
      className="relative h-[400px] cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front of Card */}
        <Card className={`absolute inset-0 backface-hidden overflow-hidden transition-all hover:shadow-lg border-border ${isFlipped ? 'pointer-events-none' : ''}`}>
          <div className="relative h-full">
            {/* Large Profile Image */}
            <div className="relative h-64 overflow-hidden bg-muted">
              <img
                src={player.image}
                alt={player.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>
            
            {/* Player Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent">
              <h3 className="text-2xl font-bold text-foreground mb-1">{player.name}</h3>
              <div className="flex items-center gap-3 text-sm mb-3">
                <span className="capitalize text-muted-foreground">{player.role}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-primary font-semibold">{player.team}</span>
              </div>
              <p className="text-xs text-muted-foreground italic">Click to view stats →</p>
            </div>
          </div>
        </Card>

        {/* Back of Card */}
        <Card className={`absolute inset-0 backface-hidden rotate-y-180 overflow-hidden border-border ${!isFlipped ? 'pointer-events-none' : ''}`}>
          <CardContent className="p-4 h-full overflow-y-auto space-y-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">{player.name}</h3>
                <p className="text-xs text-muted-foreground">Click to flip back</p>
              </div>
              <span className="text-xs text-primary font-medium">{player.team}</span>
            </div>

            {/* Stats Grid */}
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
                  <div className="bg-muted/50 rounded p-2">
                    <div className="text-muted-foreground">Wides</div>
                    <div className="font-semibold text-sm">{(stats as BowlerStats).wides}</div>
                  </div>
                </>
              )}
            </div>

            {/* Teams Played Against */}
            <div className="text-xs">
              <div className="text-muted-foreground mb-1 font-medium">Played Against</div>
              <div className="flex flex-wrap gap-1">
                {stats.teamsPlayedAgainst.slice(0, 5).map((team, idx) => (
                  <span key={idx} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                    {team}
                  </span>
                ))}
                {stats.teamsPlayedAgainst.length > 5 && (
                  <span className="text-muted-foreground">+{stats.teamsPlayedAgainst.length - 5}</span>
                )}
              </div>
            </div>

            {/* Special Deliveries for Bowlers */}
            {player.role === "bowler" && (
              <div className="text-xs">
                <div className="text-muted-foreground mb-1 font-medium">Specialties</div>
                <div className="flex flex-wrap gap-1">
                  {(stats as BowlerStats).specialDeliveries.map((delivery, idx) => (
                    <span key={idx} className="bg-accent/50 px-2 py-0.5 rounded text-xs">
                      {delivery}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Voice Controls */}
            <div 
              className="space-y-2 pt-2 border-t border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <Select value={selectedVoice} onValueChange={setSelectedVoice} disabled={isLoading || isPlaying}>
                <SelectTrigger className="w-full h-9 text-xs bg-background">
                  <SelectValue placeholder="Voice" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {VOICE_OPTIONS.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id} className="cursor-pointer text-xs">
                      <span className="font-medium">{voice.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVoicePlay();
                }}
                disabled={isPlaying || isLoading}
                className="w-full h-9 text-xs"
                size="sm"
                variant={isPlaying ? "secondary" : "default"}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Loading...
                  </>
                ) : isPlaying ? (
                  <>
                    <VolumeX className="mr-1 h-3 w-3" />
                    Playing
                  </>
                ) : (
                  <>
                    <Volume2 className="mr-1 h-3 w-3" />
                    Hear Stats
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
