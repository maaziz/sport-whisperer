import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Volume2, VolumeX, Loader2, BarChart3, User } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PlayerChartsDialog } from "./PlayerChartsDialog";
import { textToSpeech, VOICE_OPTIONS } from "@/lib/elevenlabs";
import { trackInteraction, trackPlayerView } from "@/lib/analytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GenericPlayerCardProps {
  player: any;
  generateNarration: (player: any) => string;
  renderStats: (player: any, isCompact?: boolean) => React.ReactNode;
  sport: "cricket" | "nfl" | "soccer" | "basketball" | "mlb" | "nhl";
  index?: number;
}

export const GenericPlayerCard = ({ 
  player, 
  generateNarration,
  renderStats,
  sport,
  index = 0
}: GenericPlayerCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(VOICE_OPTIONS[0].id);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

  const playFlipSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const handleVoicePlay = async () => {
    if (isLoading || isPlaying) return;
    
    const narration = generateNarration(player);
    setIsLoading(true);
    
    try {
      setIsPlaying(true);
      trackInteraction('voicePlay');
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

  return (
    <div 
      className="relative h-[400px] cursor-pointer perspective-1000 animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => {
        playFlipSound();
        setIsFlipped(!isFlipped);
        if (!isFlipped) {
          trackInteraction('cardFlip');
          trackPlayerView(player.name);
        }
      }}
    >
      <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front of Card */}
        <Card className={`absolute inset-0 backface-hidden overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-border ${isFlipped ? 'pointer-events-none' : ''}`}>
          <div className="relative h-full">
            {/* Large Profile Image */}
            <div className="relative h-64 overflow-hidden bg-muted group">
              {!imageLoaded && !imageError && (
                <Skeleton className="absolute inset-0 h-full w-full" />
              )}
              {imageError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <User className="w-32 h-32 text-muted-foreground" />
                </div>
              ) : (
                <img
                  src={player.image}
                  alt={player.name}
                  loading="lazy"
                  className={`h-full w-full object-cover object-[50%_15%] transition-all duration-500 contrast-[1.15] brightness-[1.05] saturate-[1.1] group-hover:scale-110 ${
                    imageLoaded ? 'opacity-100 animate-fade-in' : 'opacity-0'
                  }`}
                  style={{ imageRendering: 'auto' }}
                  onError={() => {
                    setImageError(true);
                    setImageLoaded(true);
                  }}
                  onLoad={() => {
                    setImageLoaded(true);
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
            </div>
            
            {/* Player Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent">
              <h3 className="text-2xl font-bold text-foreground mb-1">{player.name}</h3>
              <div className="flex items-center gap-3 text-sm mb-3">
                <span className="capitalize text-muted-foreground">
                  {player.role || player.position}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-primary font-semibold">{player.team}</span>
              </div>
              <p className="text-xs text-muted-foreground italic">Click to view stats →</p>
            </div>
          </div>
        </Card>

        {/* Back of Card */}
        <Card className={`absolute inset-0 backface-hidden rotate-y-180 overflow-hidden transition-all duration-300 hover:shadow-2xl border-border ${!isFlipped ? 'pointer-events-none' : ''}`}>
          <CardContent className="p-4 h-full overflow-y-auto space-y-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">{player.name}</h3>
                <p className="text-xs text-muted-foreground">Click to flip back</p>
              </div>
              <span className="text-xs text-primary font-medium">{player.team}</span>
            </div>

            {/* Stats */}
            {renderStats(player, false)}

            {/* Charts Button */}
            <div 
              className="pt-2 border-t border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  trackInteraction('chartView');
                  setShowCharts(true);
                }}
                className="w-full h-9 text-xs mb-2"
                size="sm"
                variant="outline"
              >
                <BarChart3 className="mr-1 h-3 w-3" />
                View Performance Charts
              </Button>
            </div>

            {/* Voice Controls */}
            <div 
              className="space-y-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Select value={selectedVoice} onValueChange={setSelectedVoice} disabled={isLoading || isPlaying}>
                <SelectTrigger className="w-full h-9 text-xs bg-background">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {VOICE_OPTIONS.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id} className="cursor-pointer text-xs">
                      <span className="font-medium">{voice.name}</span>
                      <span className="text-muted-foreground ml-2 text-[10px]">{voice.description}</span>
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

      <PlayerChartsDialog 
        open={showCharts}
        onOpenChange={setShowCharts}
        player={player}
        sport={sport}
      />
    </div>
  );
};
