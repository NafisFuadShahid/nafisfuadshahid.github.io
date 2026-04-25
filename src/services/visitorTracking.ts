export interface VisitorLocation {
  country: string;
  countryCode: string;
  city: string;
  lat: number;
  lon: number;
  timestamp: number;
}

const VISITORS_KEY = 'portfolio_visitors';
const VISITOR_ID_KEY = 'portfolio_visitor_id';

// Generate a simple visitor ID
function generateVisitorId(): string {
  return `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get or create visitor ID
function getVisitorId(): string {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = generateVisitorId();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

// Get stored visitors
export function getStoredVisitors(): VisitorLocation[] {
  try {
    const stored = localStorage.getItem(VISITORS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Add a new visitor
function addVisitor(location: VisitorLocation) {
  const visitors = getStoredVisitors();
  visitors.push(location);
  localStorage.setItem(VISITORS_KEY, JSON.stringify(visitors));
}

// Check if visitor has already been tracked
function hasTrackedToday(): boolean {
  const visitorId = getVisitorId();
  const visitors = getStoredVisitors();
  const today = new Date().setHours(0, 0, 0, 0);

  return visitors.some(v =>
    v.timestamp >= today &&
    localStorage.getItem(VISITOR_ID_KEY) === visitorId
  );
}

// Track current visitor using ipapi.co (free tier: 150 requests/day)
export async function trackVisitor(): Promise<VisitorLocation | null> {
  // Don't track if already tracked today
  if (hasTrackedToday()) {
    return null;
  }

  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error('Failed to fetch location');

    const data = await response.json();

    const location: VisitorLocation = {
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || 'XX',
      city: data.city || 'Unknown',
      lat: parseFloat(data.latitude) || 0,
      lon: parseFloat(data.longitude) || 0,
      timestamp: Date.now(),
    };

    addVisitor(location);
    return location;
  } catch (error) {
    console.error('Failed to track visitor:', error);
    return null;
  }
}

// Get unique visitor count
export function getUniqueVisitorCount(): number {
  const visitors = getStoredVisitors();
  // Group by approximate location (same city)
  const uniqueLocations = new Set(
    visitors.map(v => `${v.city}-${v.countryCode}`)
  );
  return uniqueLocations.size;
}

// Get visitor locations grouped by country
export function getVisitorsByCountry(): Map<string, { count: number; lat: number; lon: number; city: string }> {
  const visitors = getStoredVisitors();
  const byCountry = new Map<string, { count: number; lat: number; lon: number; city: string }>();

  visitors.forEach(v => {
    const existing = byCountry.get(v.countryCode);
    if (existing) {
      existing.count++;
    } else {
      byCountry.set(v.countryCode, {
        count: 1,
        lat: v.lat,
        lon: v.lon,
        city: v.city,
      });
    }
  });

  return byCountry;
}
