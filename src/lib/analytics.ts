// Client-side analytics tracking using localStorage
// Note: This is limited to browser storage and won't persist across devices

interface AnalyticsData {
  totalVisits: number;
  sportViews: Record<string, number>;
  playerViews: Record<string, number>;
  interactions: {
    cardFlips: number;
    voicePlays: number;
    chartViews: number;
  };
  lastVisit: string;
}

const ANALYTICS_KEY = 'sports-stats-analytics';

function getAnalytics(): AnalyticsData {
  const stored = localStorage.getItem(ANALYTICS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return createEmptyAnalytics();
    }
  }
  return createEmptyAnalytics();
}

function createEmptyAnalytics(): AnalyticsData {
  return {
    totalVisits: 0,
    sportViews: {},
    playerViews: {},
    interactions: {
      cardFlips: 0,
      voicePlays: 0,
      chartViews: 0,
    },
    lastVisit: new Date().toISOString(),
  };
}

function saveAnalytics(data: AnalyticsData): void {
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
}

export function trackVisit(): void {
  const data = getAnalytics();
  data.totalVisits += 1;
  data.lastVisit = new Date().toISOString();
  saveAnalytics(data);
}

export function trackSportView(sport: string): void {
  const data = getAnalytics();
  data.sportViews[sport] = (data.sportViews[sport] || 0) + 1;
  saveAnalytics(data);
}

export function trackPlayerView(playerName: string): void {
  const data = getAnalytics();
  data.playerViews[playerName] = (data.playerViews[playerName] || 0) + 1;
  saveAnalytics(data);
}

export function trackInteraction(type: 'cardFlip' | 'voicePlay' | 'chartView'): void {
  const data = getAnalytics();
  if (type === 'cardFlip') data.interactions.cardFlips += 1;
  if (type === 'voicePlay') data.interactions.voicePlays += 1;
  if (type === 'chartView') data.interactions.chartViews += 1;
  saveAnalytics(data);
}

export function getAnalyticsData(): AnalyticsData {
  return getAnalytics();
}

export function clearAnalytics(): void {
  localStorage.removeItem(ANALYTICS_KEY);
}

export function exportAnalyticsAsJSON(): void {
  const data = getAnalytics();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportAnalyticsAsCSV(): void {
  const data = getAnalytics();
  
  // Create CSV content
  let csv = 'Category,Metric,Value\n';
  
  // Summary data
  csv += `Summary,Total Visits,${data.totalVisits}\n`;
  csv += `Summary,Last Visit,${data.lastVisit}\n`;
  csv += `Summary,Total Sport Views,${Object.values(data.sportViews).reduce((a, b) => a + b, 0)}\n`;
  csv += `Summary,Total Player Views,${Object.values(data.playerViews).reduce((a, b) => a + b, 0)}\n`;
  csv += `Summary,Card Flips,${data.interactions.cardFlips}\n`;
  csv += `Summary,Voice Plays,${data.interactions.voicePlays}\n`;
  csv += `Summary,Chart Views,${data.interactions.chartViews}\n`;
  csv += '\n';
  
  // Sport views
  csv += 'Sport Views\n';
  Object.entries(data.sportViews).forEach(([sport, views]) => {
    csv += `Sport,${sport},${views}\n`;
  });
  csv += '\n';
  
  // Player views
  csv += 'Player Views\n';
  Object.entries(data.playerViews)
    .sort(([, a], [, b]) => b - a)
    .forEach(([player, views]) => {
      csv += `Player,${player},${views}\n`;
    });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
