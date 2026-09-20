import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot, Label, ComposedChart } from "recharts";
import { Player, BatsmanStats, BowlerStats } from "@/types/cricket";
import { NFLPlayer, SoccerPlayer, BasketballPlayer, MLBPlayer, NHLPlayer } from "@/types/sports";
import { Trophy, Award, Calendar, Target } from "lucide-react";
import { useState, useEffect } from "react";

// Virat Kohli 2025 prediction data
const viratKohliPredictions = `Match Date,Opponent,Runs,Predicted Runs,error
9-Feb-25,ENG,5,4.8,0.2
12-Feb-25,ENG,52,50.9,1.1
20-Feb-25,BAN,22,22.0,0.0
23-Feb-25,PAK,100,100.7,-0.7
2-Mar-25,NZ,11,11.0,0.0
4-Mar-25,AUS,84,85.8,-1.8
9-Mar-25,NZ,1,1.1,-0.1
19-Oct-25,AUS,0,0.0,0.0
23-Oct-25,AUS,0,0.0,0.0
25-Oct-25,AUS,74,75.6,-1.6`;

const parseViratKohliData = () => {
  const lines = viratKohliPredictions.trim().split('\n');
  const data = lines.slice(1).map(line => {
    const [date, opponent, runs, predictedRuns] = line.split(',');
    return {
      date: date.trim(),
      opponent: opponent.trim(),
      runs: parseFloat(runs),
      predictedRuns: parseFloat(predictedRuns)
    };
  });
  return data;
};

interface PlayerChartsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player | NFLPlayer | SoccerPlayer | BasketballPlayer | any;
  sport: "cricket" | "nfl" | "soccer" | "basketball" | "mlb" | "nhl";
}

export const PlayerChartsDialog = ({ open, onOpenChange, player, sport }: PlayerChartsDialogProps) => {
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false);

  const handleMilestoneClick = (milestone: any) => {
    setSelectedMilestone(milestone);
    setShowMilestoneDialog(true);
  };

  const renderCricketCharts = (player: Player) => {
    const stats = player.stats;
    
    if (player.role === "batsman" || player.role === "all-rounder") {
      const batsmanStats = stats as BatsmanStats;
      const barData = [
        { name: "Matches", value: batsmanStats.matchesPlayed },
        { name: "High Score", value: batsmanStats.highestScore },
        { name: "Fours", value: batsmanStats.boundaries.fours },
        { name: "Sixes", value: batsmanStats.boundaries.sixes },
      ];

      const radarData = [
        { stat: "Consistency", value: Math.min(batsmanStats.matchesPlayed / 3, 100) },
        { stat: "Power", value: (batsmanStats.boundaries.sixes * 10) },
        { stat: "Technique", value: (batsmanStats.boundaries.fours * 2) },
        { stat: "High Score", value: batsmanStats.highestScore / 2 },
        { stat: "Experience", value: Math.min(batsmanStats.teamsPlayedAgainst.length * 15, 100) },
      ];

      const timelineData = batsmanStats.careerTimeline || [
        { year: "2019", runs: 850, average: 42.5, strikeRate: 85 },
        { year: "2020", runs: 920, average: 46.0, strikeRate: 88 },
        { 
          year: "2021", 
          runs: 1050, 
          average: 52.5, 
          strikeRate: 92, 
          milestone: "Player of the Series",
          milestoneDetails: {
            title: "Player of the Series",
            description: "Outstanding performance in bilateral series against Australia",
            achievement: "Scored 450+ runs with 3 centuries",
            date: "March 2021"
          }
        },
        { 
          year: "2022", 
          runs: 1200, 
          average: 60.0, 
          strikeRate: 95, 
          milestone: "World Cup Champion",
          milestoneDetails: {
            title: "World Cup Champion",
            description: "Led team to World Cup victory with exceptional batting",
            achievement: "Tournament top scorer with 650+ runs",
            date: "November 2022"
          }
        },
        { year: "2023", runs: 1350, average: 67.5, strikeRate: 98 },
      ];

      const CustomDot = (props: any) => {
        const { cx, cy, payload } = props;
        if (payload.milestone) {
          return (
            <g 
              onClick={(e) => {
                e.stopPropagation();
                handleMilestoneClick(payload.milestoneDetails);
              }}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={cx} cy={cy} r={10} fill="hsl(var(--secondary))" stroke="hsl(var(--foreground))" strokeWidth={2} />
              <circle cx={cx} cy={cy} r={4} fill="hsl(var(--foreground))" />
            </g>
          );
        }
        return <circle cx={cx} cy={cy} r={4} fill="hsl(var(--primary))" />;
      };

      const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
          return (
            <div className="bg-background border border-border rounded p-3 shadow-lg">
              <p className="font-semibold text-foreground">{payload[0].payload.year}</p>
              <p className="text-sm text-muted-foreground">Runs: {payload[0].payload.runs}</p>
              <p className="text-sm text-muted-foreground">Average: {payload[0].payload.average}</p>
              {payload[0].payload.milestone && (
                <p className="text-sm font-medium text-secondary mt-2 flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {payload[0].payload.milestone}
                </p>
              )}
            </div>
          );
        }
        return null;
      };

      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Career Progression</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="runs" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Runs" dot={<CustomDot />} />
                <Area type="monotone" dataKey="average" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.4} name="Average" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Performance Metrics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }} 
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Skill Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="stat" stroke="hsl(var(--foreground))" />
                <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
                <Radar name={player.name} dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {player.name === "Virat Kohli" && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Dataiku Model - 2025 Runs Prediction</h3>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={parseViratKohliData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="opponent" 
                    stroke="hsl(var(--foreground))"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="hsl(var(--foreground))" label={{ value: 'Runs', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border border-border rounded p-3 shadow-lg">
                            <p className="font-semibold text-foreground">{payload[0].payload.date}</p>
                            <p className="text-sm text-foreground">vs {payload[0].payload.opponent}</p>
                            <p className="text-sm text-primary font-medium mt-1">Actual Runs: {payload[0].payload.runs}</p>
                            <p className="text-sm text-secondary font-medium">Predicted Runs: {payload[0].payload.predictedRuns}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Accuracy: {Math.abs(payload[0].payload.runs - payload[0].payload.predictedRuns) < 2 ? '🎯 Excellent' : '✓ Good'}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="runs" fill="hsl(var(--primary))" name="Actual Runs" />
                  <Line 
                    type="monotone" 
                    dataKey="predictedRuns" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={3}
                    name="Predicted Runs"
                    dot={{ fill: "hsl(var(--secondary))", r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Data Source: DataIku ML Model - 2025 Performance Predictions
              </p>
            </div>
          )}
        </div>
      );
    } else {
      const bowlerStats = stats as BowlerStats;
      const barData = [
        { name: "Matches", value: bowlerStats.matchesPlayed },
        { name: "Wickets", value: bowlerStats.wickets },
        { name: "Overs", value: bowlerStats.overs },
        { name: "Economy", value: bowlerStats.economyRate * 10 },
      ];

      const radarData = [
        { stat: "Wickets", value: Math.min(bowlerStats.wickets / 2, 100) },
        { stat: "Economy", value: Math.max(100 - (bowlerStats.economyRate * 15), 0) },
        { stat: "Accuracy", value: Math.max(100 - bowlerStats.wides, 50) },
        { stat: "Experience", value: Math.min(bowlerStats.teamsPlayedAgainst.length * 15, 100) },
        { stat: "Variety", value: bowlerStats.specialDeliveries.length * 25 },
      ];

      const timelineData = bowlerStats.careerTimeline || [
        { year: "2019", wickets: 28, average: 24.5, economyRate: 3.8 },
        { 
          year: "2020", 
          wickets: 32, 
          average: 22.3, 
          economyRate: 3.5, 
          milestone: "Best Bowling Figures",
          milestoneDetails: {
            title: "Best Bowling Figures",
            description: "Record-breaking bowling performance",
            achievement: "7/25 in ODI match",
            date: "August 2020"
          }
        },
        { year: "2021", wickets: 38, average: 21.0, economyRate: 3.2 },
        { 
          year: "2022", 
          wickets: 42, 
          average: 19.8, 
          economyRate: 3.0, 
          milestone: "ICC Bowler of the Year",
          milestoneDetails: {
            title: "ICC Bowler of the Year",
            description: "Recognized as world's best bowler",
            achievement: "Most wickets in international cricket",
            date: "December 2022"
          }
        },
        { year: "2023", wickets: 45, average: 18.5, economyRate: 2.8 },
      ];

      const CustomDot = (props: any) => {
        const { cx, cy, payload } = props;
        if (payload.milestone) {
          return (
            <g 
              onClick={(e) => {
                e.stopPropagation();
                handleMilestoneClick(payload.milestoneDetails);
              }}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={cx} cy={cy} r={10} fill="hsl(var(--secondary))" stroke="hsl(var(--foreground))" strokeWidth={2} />
              <circle cx={cx} cy={cy} r={4} fill="hsl(var(--foreground))" />
            </g>
          );
        }
        return <circle cx={cx} cy={cy} r={4} fill="hsl(var(--primary))" />;
      };

      const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
          return (
            <div className="bg-background border border-border rounded p-3 shadow-lg">
              <p className="font-semibold text-foreground">{payload[0].payload.year}</p>
              <p className="text-sm text-muted-foreground">Wickets: {payload[0].payload.wickets}</p>
              <p className="text-sm text-muted-foreground">Average: {payload[0].payload.average}</p>
              {payload[0].payload.milestone && (
                <p className="text-sm font-medium text-secondary mt-2 flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {payload[0].payload.milestone}
                </p>
              )}
            </div>
          );
        }
        return null;
      };

      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Career Progression</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="wickets" stroke="hsl(var(--primary))" strokeWidth={2} name="Wickets" dot={<CustomDot />} />
                <Line type="monotone" dataKey="average" stroke="hsl(var(--secondary))" strokeWidth={2} name="Average" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Performance Metrics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }} 
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Skill Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="stat" stroke="hsl(var(--foreground))" />
                <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
                <Radar name={player.name} dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }
  };

  const renderNFLCharts = (player: NFLPlayer) => {
    const timelineData = player.stats.careerTimeline || [
      { year: "2019", touchdowns: 12, yards: 1200, games: 16 },
      { 
        year: "2020", 
        touchdowns: 15, 
        yards: 1450, 
        games: 16, 
        milestone: "Pro Bowl Selection",
        milestoneDetails: {
          title: "Pro Bowl Selection",
          description: "First career Pro Bowl appearance",
          achievement: "Led conference in touchdowns",
          date: "January 2021"
        }
      },
      { year: "2021", touchdowns: 18, yards: 1600, games: 17 },
      { 
        year: "2022", 
        touchdowns: 22, 
        yards: 1850, 
        games: 17, 
        milestone: "Super Bowl Champion",
        milestoneDetails: {
          title: "Super Bowl LVII Champion",
          description: "Won first Super Bowl championship",
          achievement: "3 TDs and 150+ yards in championship game",
          date: "February 2023"
        }
      },
      { year: "2023", touchdowns: 25, yards: 2100, games: 17 },
    ];

    const CustomDot = (props: any) => {
      const { cx, cy, payload } = props;
      if (payload.milestone) {
        return (
          <g 
            onClick={(e) => {
              e.stopPropagation();
              handleMilestoneClick(payload.milestoneDetails);
            }}
            style={{ cursor: 'pointer' }}
          >
            <circle cx={cx} cy={cy} r={10} fill="hsl(var(--secondary))" stroke="hsl(var(--foreground))" strokeWidth={2} />
            <circle cx={cx} cy={cy} r={4} fill="hsl(var(--foreground))" />
          </g>
        );
      }
      return <circle cx={cx} cy={cy} r={4} fill="hsl(var(--primary))" />;
    };

    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-background border border-border rounded p-3 shadow-lg">
            <p className="font-semibold text-foreground">{payload[0].payload.year}</p>
            <p className="text-sm text-muted-foreground">Touchdowns: {payload[0].payload.touchdowns}</p>
            <p className="text-sm text-muted-foreground">Yards: {payload[0].payload.yards}</p>
            {payload[0].payload.milestone && (
              <p className="text-sm font-medium text-secondary mt-2 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {payload[0].payload.milestone}
              </p>
            )}
          </div>
        );
      }
      return null;
    };

    const barData = [
      { name: "Games", value: player.stats.gamesPlayed },
      { name: "Touchdowns", value: player.stats.touchdowns },
      { name: "Yards", value: player.stats.yards / 100 },
      { name: "Receptions", value: player.stats.receptions || 0 },
    ];

    const radarData = [
      { stat: "Experience", value: Math.min(player.stats.gamesPlayed / 2, 100) },
      { stat: "Scoring", value: Math.min(player.stats.touchdowns * 2, 100) },
      { stat: "Yardage", value: Math.min(player.stats.yards / 300, 100) },
      { stat: "Consistency", value: Math.min(player.stats.teamsPlayedAgainst.length * 15, 100) },
      { stat: "Impact", value: Math.min((player.stats.touchdowns * player.stats.yards) / 10000, 100) },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Career Progression</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="touchdowns" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Touchdowns" dot={<CustomDot />} />
              <Area type="monotone" dataKey="yards" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.4} name="Yards" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }} 
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Skill Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="stat" stroke="hsl(var(--foreground))" />
              <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
              <Radar name={player.name} dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderSoccerCharts = (player: SoccerPlayer) => {
    const timelineData = player.stats.careerTimeline || [
      { year: "2019", goals: 24, assists: 12, matches: 38 },
      { 
        year: "2020", 
        goals: 28, 
        assists: 15, 
        matches: 40, 
        milestone: "Golden Boot Winner",
        milestoneDetails: {
          title: "Golden Boot Winner",
          description: "League top scorer award",
          achievement: "28 goals in league season",
          date: "May 2020"
        }
      },
      { year: "2021", goals: 32, assists: 18, matches: 42 },
      { 
        year: "2022", 
        goals: 35, 
        assists: 20, 
        matches: 45, 
        milestone: "Champions League Winner",
        milestoneDetails: {
          title: "UEFA Champions League Winner",
          description: "Won Europe's premier club competition",
          achievement: "Scored in final and semi-final",
          date: "May 2022"
        }
      },
      { year: "2023", goals: 38, assists: 22, matches: 48 },
    ];

    const CustomDot = (props: any) => {
      const { cx, cy, payload } = props;
      if (payload.milestone) {
        return (
          <g 
            onClick={(e) => {
              e.stopPropagation();
              handleMilestoneClick(payload.milestoneDetails);
            }}
            style={{ cursor: 'pointer' }}
          >
            <circle cx={cx} cy={cy} r={10} fill="hsl(var(--secondary))" stroke="hsl(var(--foreground))" strokeWidth={2} />
            <circle cx={cx} cy={cy} r={4} fill="hsl(var(--foreground))" />
          </g>
        );
      }
      return <circle cx={cx} cy={cy} r={4} fill="hsl(var(--primary))" />;
    };

    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-background border border-border rounded p-3 shadow-lg">
            <p className="font-semibold text-foreground">{payload[0].payload.year}</p>
            <p className="text-sm text-muted-foreground">Goals: {payload[0].payload.goals}</p>
            <p className="text-sm text-muted-foreground">Assists: {payload[0].payload.assists}</p>
            {payload[0].payload.milestone && (
              <p className="text-sm font-medium text-secondary mt-2 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {payload[0].payload.milestone}
              </p>
            )}
          </div>
        );
      }
      return null;
    };

    const barData = [
      { name: "Matches", value: player.stats.matchesPlayed },
      { name: "Goals", value: player.stats.goals },
      { name: "Assists", value: player.stats.assists },
      { name: "Clean Sheets", value: player.stats.cleanSheets || 0 },
    ];

    const radarData = [
      { stat: "Scoring", value: Math.min(player.stats.goals / 3, 100) },
      { stat: "Playmaking", value: Math.min(player.stats.assists / 2, 100) },
      { stat: "Experience", value: Math.min(player.stats.matchesPlayed / 10, 100) },
      { stat: "Discipline", value: Math.max(100 - (player.stats.yellowCards * 2 + player.stats.redCards * 10), 0) },
      { stat: "Consistency", value: Math.min(player.stats.teamsPlayedAgainst.length * 15, 100) },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Career Progression</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="goals" stroke="hsl(var(--primary))" strokeWidth={2} name="Goals" dot={<CustomDot />} />
              <Line type="monotone" dataKey="assists" stroke="hsl(var(--secondary))" strokeWidth={2} name="Assists" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }} 
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Skill Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="stat" stroke="hsl(var(--foreground))" />
              <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
              <Radar name={player.name} dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderBasketballCharts = (player: BasketballPlayer) => {
    const timelineData = player.stats.careerTimeline || [
      { year: "2019", points: 1800, rebounds: 450, assists: 380 },
      { 
        year: "2020", 
        points: 1950, 
        rebounds: 480, 
        assists: 420, 
        milestone: "All-Star Selection",
        milestoneDetails: {
          title: "NBA All-Star Selection",
          description: "First NBA All-Star game appearance",
          achievement: "Averaged 25+ PPG in season",
          date: "February 2020"
        }
      },
      { year: "2021", points: 2100, rebounds: 520, assists: 450 },
      { 
        year: "2022", 
        points: 2250, 
        rebounds: 550, 
        assists: 490, 
        milestone: "NBA Champion",
        milestoneDetails: {
          title: "NBA Championship Winner",
          description: "Won first NBA championship",
          achievement: "Finals MVP with dominant performances",
          date: "June 2022"
        }
      },
      { 
        year: "2023", 
        points: 2400, 
        rebounds: 580, 
        assists: 520, 
        milestone: "MVP Award",
        milestoneDetails: {
          title: "NBA Most Valuable Player",
          description: "League MVP award winner",
          achievement: "Led team to best record with 28 PPG",
          date: "June 2023"
        }
      },
    ];

    const CustomDot = (props: any) => {
      const { cx, cy, payload } = props;
      if (payload.milestone) {
        return (
          <g 
            onClick={(e) => {
              e.stopPropagation();
              handleMilestoneClick(payload.milestoneDetails);
            }}
            style={{ cursor: 'pointer' }}
          >
            <circle cx={cx} cy={cy} r={10} fill="hsl(var(--secondary))" stroke="hsl(var(--foreground))" strokeWidth={2} />
            <circle cx={cx} cy={cy} r={4} fill="hsl(var(--foreground))" />
          </g>
        );
      }
      return <circle cx={cx} cy={cy} r={4} fill="hsl(var(--primary))" />;
    };

    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-background border border-border rounded p-3 shadow-lg">
            <p className="font-semibold text-foreground">{payload[0].payload.year}</p>
            <p className="text-sm text-muted-foreground">Points: {payload[0].payload.points}</p>
            <p className="text-sm text-muted-foreground">Rebounds: {payload[0].payload.rebounds}</p>
            <p className="text-sm text-muted-foreground">Assists: {payload[0].payload.assists}</p>
            {payload[0].payload.milestone && (
              <p className="text-sm font-medium text-secondary mt-2 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {payload[0].payload.milestone}
              </p>
            )}
          </div>
        );
      }
      return null;
    };

    const barData = [
      { name: "Games", value: player.stats.gamesPlayed },
      { name: "Points", value: player.stats.points / 100 },
      { name: "Rebounds", value: player.stats.rebounds / 100 },
      { name: "Assists", value: player.stats.assists / 100 },
    ];

    const radarData = [
      { stat: "Scoring", value: Math.min(player.stats.points / 200, 100) },
      { stat: "Rebounding", value: Math.min(player.stats.rebounds / 100, 100) },
      { stat: "Playmaking", value: Math.min(player.stats.assists / 100, 100) },
      { stat: "Experience", value: Math.min(player.stats.gamesPlayed / 10, 100) },
      { stat: "Consistency", value: Math.min(player.stats.teamsPlayedAgainst.length * 15, 100) },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Career Progression</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="points" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Points" dot={<CustomDot />} />
              <Area type="monotone" dataKey="rebounds" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.4} name="Rebounds" />
              <Area type="monotone" dataKey="assists" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} name="Assists" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }} 
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Skill Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="stat" stroke="hsl(var(--foreground))" />
              <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
              <Radar name={player.name} dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderMLBCharts = (player: MLBPlayer) => {
    const isPitcher = player.position === "pitcher";
    
    // Timeline data with milestones
    const timelineData = player.stats.careerTimeline || (isPitcher ? [
      { year: "2019", era: 3.5, strikeouts: 180, wins: 12 },
      { 
        year: "2020", 
        era: 3.2, 
        strikeouts: 195, 
        wins: 14, 
        milestone: "All-Star Selection",
        milestoneDetails: {
          title: "MLB All-Star Selection",
          description: "First career All-Star game appearance",
          achievement: "Led league in strikeouts at midseason",
          date: "July 2020"
        }
      },
      { year: "2021", era: 2.9, strikeouts: 220, wins: 16 },
      { 
        year: "2022", 
        era: 2.5, 
        strikeouts: 245, 
        wins: 18, 
        milestone: "Cy Young Award",
        milestoneDetails: {
          title: "Cy Young Award Winner",
          description: "Best pitcher in league",
          achievement: "245 strikeouts with 2.50 ERA",
          date: "November 2022"
        }
      },
      { year: "2023", era: 2.8, strikeouts: 230, wins: 15 },
    ] : [
      { year: "2019", homeRuns: 25, rbi: 80, battingAverage: 0.275 },
      { 
        year: "2020", 
        homeRuns: 30, 
        rbi: 95, 
        battingAverage: 0.285, 
        milestone: "Silver Slugger Award",
        milestoneDetails: {
          title: "Silver Slugger Award",
          description: "Best offensive player at position",
          achievement: "30 HRs and .285 batting average",
          date: "November 2020"
        }
      },
      { year: "2021", homeRuns: 35, rbi: 105, battingAverage: 0.290 },
      { 
        year: "2022", 
        homeRuns: 42, 
        rbi: 120, 
        battingAverage: 0.305, 
        milestone: "MVP Award",
        milestoneDetails: {
          title: "American League MVP",
          description: "Most Valuable Player award",
          achievement: "Led league with 42 home runs",
          date: "November 2022"
        }
      },
      { year: "2023", homeRuns: 38, rbi: 110, battingAverage: 0.295 },
    ]);

    const CustomDot = (props: any) => {
      const { cx, cy, payload } = props;
      if (payload.milestone) {
        return (
          <g 
            onClick={(e) => {
              e.stopPropagation();
              handleMilestoneClick(payload.milestoneDetails);
            }}
            style={{ cursor: 'pointer' }}
          >
            <circle cx={cx} cy={cy} r={10} fill="hsl(var(--secondary))" stroke="hsl(var(--foreground))" strokeWidth={2} />
            <circle cx={cx} cy={cy} r={4} fill="hsl(var(--foreground))" />
          </g>
        );
      }
      return <circle cx={cx} cy={cy} r={4} fill="hsl(var(--primary))" />;
    };

    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-background border border-border rounded p-3 shadow-lg">
            <p className="font-semibold text-foreground">{payload[0].payload.year}</p>
            {isPitcher ? (
              <>
                <p className="text-sm text-muted-foreground">ERA: {payload[0].payload.era}</p>
                <p className="text-sm text-muted-foreground">Strikeouts: {payload[0].payload.strikeouts}</p>
                <p className="text-sm text-muted-foreground">Wins: {payload[0].payload.wins}</p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Home Runs: {payload[0].payload.homeRuns}</p>
                <p className="text-sm text-muted-foreground">RBI: {payload[0].payload.rbi}</p>
                <p className="text-sm text-muted-foreground">Average: {payload[0].payload.battingAverage}</p>
              </>
            )}
            {payload[0].payload.milestone && (
              <p className="text-sm font-medium text-secondary mt-2 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {payload[0].payload.milestone}
              </p>
            )}
          </div>
        );
      }
      return null;
    };

    const barData = isPitcher ? [
      { name: "Games", value: player.stats.gamesPlayed },
      { name: "Wins", value: player.stats.wins || 0 },
      { name: "Strikeouts", value: (player.stats.strikeouts || 0) / 10 },
      { name: "ERA x10", value: (player.stats.era || 0) * 10 },
    ] : [
      { name: "Games", value: player.stats.gamesPlayed },
      { name: "Home Runs", value: player.stats.homeRuns || 0 },
      { name: "RBI", value: player.stats.rbi || 0 },
      { name: "Batting Avg x100", value: (player.stats.battingAverage || 0) * 100 },
    ];

    const radarData = isPitcher ? [
      { stat: "Experience", value: Math.min(player.stats.gamesPlayed / 4, 100) },
      { stat: "Wins", value: Math.min((player.stats.wins || 0) * 5, 100) },
      { stat: "Strikeouts", value: Math.min((player.stats.strikeouts || 0) / 25, 100) },
      { stat: "Control", value: Math.max(100 - ((player.stats.era || 3) * 15), 0) },
      { stat: "Consistency", value: Math.min(player.stats.teamsPlayedAgainst.length * 15, 100) },
    ] : [
      { stat: "Power", value: Math.min((player.stats.homeRuns || 0) * 2, 100) },
      { stat: "RBI", value: Math.min((player.stats.rbi || 0) / 10, 100) },
      { stat: "Average", value: (player.stats.battingAverage || 0) * 350 },
      { stat: "Speed", value: Math.min((player.stats.stolenBases || 0) * 3, 100) },
      { stat: "Experience", value: Math.min(player.stats.gamesPlayed / 15, 100) },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Career Progression</h3>
          <ResponsiveContainer width="100%" height={300}>
            {isPitcher ? (
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="strikeouts" stroke="hsl(var(--primary))" strokeWidth={2} name="Strikeouts" dot={<CustomDot />} />
                <Line type="monotone" dataKey="wins" stroke="hsl(var(--secondary))" strokeWidth={2} name="Wins" />
              </LineChart>
            ) : (
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="homeRuns" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Home Runs" dot={<CustomDot />} />
                <Area type="monotone" dataKey="rbi" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.4} name="RBI" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }} 
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Skill Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="stat" stroke="hsl(var(--foreground))" />
              <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
              <Radar name={player.name} dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderNHLCharts = (player: NHLPlayer) => {
    const isGoalie = player.position === "goalie";
    
    // Timeline data with milestones
    const timelineData = player.stats.careerTimeline || (isGoalie ? [
      { year: "2019", wins: 28, savePercentage: 0.910 },
      { 
        year: "2020", 
        wins: 32, 
        savePercentage: 0.918, 
        milestone: "Vezina Finalist",
        milestoneDetails: {
          title: "Vezina Trophy Finalist",
          description: "Top 3 goalie in league",
          achievement: ".918 save percentage and 32 wins",
          date: "June 2020"
        }
      },
      { year: "2021", wins: 35, savePercentage: 0.920 },
      { 
        year: "2022", 
        wins: 38, 
        savePercentage: 0.925, 
        milestone: "Vezina Trophy",
        milestoneDetails: {
          title: "Vezina Trophy Winner",
          description: "Best goaltender in NHL",
          achievement: "League-leading .925 save percentage",
          date: "June 2022"
        }
      },
      { year: "2023", wins: 36, savePercentage: 0.922 },
    ] : [
      { year: "2019", goals: 28, assists: 42, points: 70 },
      { 
        year: "2020", 
        goals: 32, 
        assists: 48, 
        points: 80, 
        milestone: "Art Ross Trophy",
        milestoneDetails: {
          title: "Art Ross Trophy",
          description: "NHL leading scorer",
          achievement: "League-leading 80 points",
          date: "May 2020"
        }
      },
      { year: "2021", goals: 35, assists: 52, points: 87 },
      { 
        year: "2022", 
        goals: 42, 
        assists: 58, 
        points: 100, 
        milestone: "Hart Trophy",
        milestoneDetails: {
          title: "Hart Memorial Trophy",
          description: "NHL Most Valuable Player",
          achievement: "100-point season with dominant play",
          date: "June 2022"
        }
      },
      { year: "2023", goals: 38, assists: 55, points: 93 },
    ]);

    const CustomDot = (props: any) => {
      const { cx, cy, payload } = props;
      if (payload.milestone) {
        return (
          <g 
            onClick={(e) => {
              e.stopPropagation();
              handleMilestoneClick(payload.milestoneDetails);
            }}
            style={{ cursor: 'pointer' }}
          >
            <circle cx={cx} cy={cy} r={10} fill="hsl(var(--secondary))" stroke="hsl(var(--foreground))" strokeWidth={2} />
            <circle cx={cx} cy={cy} r={4} fill="hsl(var(--foreground))" />
          </g>
        );
      }
      return <circle cx={cx} cy={cy} r={4} fill="hsl(var(--primary))" />;
    };

    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-background border border-border rounded p-3 shadow-lg">
            <p className="font-semibold text-foreground">{payload[0].payload.year}</p>
            {isGoalie ? (
              <>
                <p className="text-sm text-muted-foreground">Wins: {payload[0].payload.wins}</p>
                <p className="text-sm text-muted-foreground">Save %: {payload[0].payload.savePercentage}</p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Goals: {payload[0].payload.goals}</p>
                <p className="text-sm text-muted-foreground">Assists: {payload[0].payload.assists}</p>
                <p className="text-sm text-muted-foreground">Points: {payload[0].payload.points}</p>
              </>
            )}
            {payload[0].payload.milestone && (
              <p className="text-sm font-medium text-secondary mt-2 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {payload[0].payload.milestone}
              </p>
            )}
          </div>
        );
      }
      return null;
    };

    const barData = isGoalie ? [
      { name: "Games", value: player.stats.gamesPlayed },
      { name: "Wins", value: player.stats.wins || 0 },
      { name: "Save % x100", value: (player.stats.savePercentage || 0) * 100 },
      { name: "Shutouts", value: player.stats.shutouts || 0 },
    ] : [
      { name: "Games", value: player.stats.gamesPlayed },
      { name: "Goals", value: player.stats.goals || 0 },
      { name: "Assists", value: player.stats.assists || 0 },
      { name: "Points", value: player.stats.points || 0 },
    ];

    const radarData = isGoalie ? [
      { stat: "Experience", value: Math.min(player.stats.gamesPlayed / 5, 100) },
      { stat: "Wins", value: Math.min((player.stats.wins || 0) / 3, 100) },
      { stat: "Save %", value: ((player.stats.savePercentage || 0.900) - 0.850) * 1000 },
      { stat: "Shutouts", value: Math.min((player.stats.shutouts || 0) * 10, 100) },
      { stat: "Consistency", value: Math.min(player.stats.teamsPlayedAgainst.length * 15, 100) },
    ] : [
      { stat: "Scoring", value: Math.min((player.stats.goals || 0) * 2, 100) },
      { stat: "Playmaking", value: Math.min((player.stats.assists || 0) * 1.5, 100) },
      { stat: "Points", value: Math.min((player.stats.points || 0), 100) },
      { stat: "Plus/Minus", value: Math.min(Math.max((player.stats.plusMinus || 0) + 50, 0), 100) },
      { stat: "Experience", value: Math.min(player.stats.gamesPlayed / 10, 100) },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Career Progression</h3>
          <ResponsiveContainer width="100%" height={300}>
            {isGoalie ? (
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="wins" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Wins" dot={<CustomDot />} />
              </AreaChart>
            ) : (
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="points" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Points" dot={<CustomDot />} />
                <Area type="monotone" dataKey="goals" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.4} name="Goals" />
                <Area type="monotone" dataKey="assists" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} name="Assists" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }} 
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Skill Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="stat" stroke="hsl(var(--foreground))" />
              <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
              <Radar name={player.name} dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderCharts = () => {
    switch (sport) {
      case "cricket":
        return renderCricketCharts(player as Player);
      case "nfl":
        return renderNFLCharts(player as NFLPlayer);
      case "soccer":
        return renderSoccerCharts(player as SoccerPlayer);
      case "basketball":
        return renderBasketballCharts(player as BasketballPlayer);
      case "mlb":
        return renderMLBCharts(player as MLBPlayer);
      case "nhl":
        return renderNHLCharts(player as NHLPlayer);
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {player.name} - Performance Analytics
            </DialogTitle>
          </DialogHeader>
          {renderCharts()}
        </DialogContent>
      </Dialog>

      {/* Milestone Details Dialog */}
      <Dialog open={showMilestoneDialog} onOpenChange={setShowMilestoneDialog}>
        <DialogContent className="max-w-md bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
              <Trophy className="w-6 h-6 text-secondary" />
              Career Milestone
            </DialogTitle>
          </DialogHeader>
          {selectedMilestone && (
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{selectedMilestone.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedMilestone.description}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium text-foreground">Achievement</h4>
                  <p className="text-sm text-muted-foreground mt-1">{selectedMilestone.achievement}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium text-foreground">Date</h4>
                  <p className="text-sm text-muted-foreground mt-1">{selectedMilestone.date}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground italic">
                  Click on highlighted markers in the timeline chart to view more milestones
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
