import { useEffect, useState } from "react";
import { getAnalyticsData, clearAnalytics, exportAnalyticsAsJSON, exportAnalyticsAsCSV } from "@/lib/analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, TrendingUp, Users, Activity, Trash2, Download, FileJson, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(getAnalyticsData());

  useEffect(() => {
    setAnalytics(getAnalyticsData());
  }, []);

  const handleClearAnalytics = () => {
    if (window.confirm("Are you sure you want to clear all analytics data? This cannot be undone.")) {
      clearAnalytics();
      setAnalytics(getAnalyticsData());
      toast({
        title: "Analytics Cleared",
        description: "All analytics data has been reset.",
      });
    }
  };

  const handleExportJSON = () => {
    exportAnalyticsAsJSON();
    toast({
      title: "Export Successful",
      description: "Analytics data exported as JSON file.",
    });
  };

  const handleExportCSV = () => {
    exportAnalyticsAsCSV();
    toast({
      title: "Export Successful",
      description: "Analytics data exported as CSV file.",
    });
  };

  // Transform data for charts
  const sportViewsData = Object.entries(analytics.sportViews).map(([sport, views]) => ({
    sport,
    views,
  }));

  const topPlayersData = Object.entries(analytics.playerViews)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([player, views]) => ({
      player,
      views,
    }));

  const interactionsData = [
    { type: "Card Flips", count: analytics.interactions.cardFlips },
    { type: "Voice Plays", count: analytics.interactions.voicePlays },
    { type: "Chart Views", count: analytics.interactions.chartViews },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">
              Analytics tracked in browser storage (last visit: {new Date(analytics.lastVisit).toLocaleString()})
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportJSON}>
              <FileJson className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button variant="outline" onClick={handleExportCSV}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="destructive" onClick={handleClearAnalytics}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.totalVisits}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sport Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Object.values(analytics.sportViews).reduce((a, b) => a + b, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Player Views</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Object.values(analytics.playerViews).reduce((a, b) => a + b, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {analytics.interactions.cardFlips +
                  analytics.interactions.voicePlays +
                  analytics.interactions.chartViews}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sport Views Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Views by Sport</CardTitle>
              <CardDescription>Total views for each sport category</CardDescription>
            </CardHeader>
            <CardContent>
              {sportViewsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sportViewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sport" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-center py-12">No sport views tracked yet</p>
              )}
            </CardContent>
          </Card>

          {/* Interactions Chart */}
          <Card>
            <CardHeader>
              <CardTitle>User Interactions</CardTitle>
              <CardDescription>Breakdown of user activity types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={interactionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="hsl(var(--accent))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Players Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Most Viewed Players</CardTitle>
            <CardDescription>Players ranked by number of views</CardDescription>
          </CardHeader>
          <CardContent>
            {topPlayersData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Player Name</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPlayersData.map((player, index) => (
                    <TableRow key={player.player}>
                      <TableCell className="font-medium">#{index + 1}</TableCell>
                      <TableCell>{player.player}</TableCell>
                      <TableCell className="text-right">{player.views}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-12">No player views tracked yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
