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

// Check if visitor has already been tracked today
function hasTrackedToday(): boolean {
  const visitorId = getVisitorId();
  const visitors = getStoredVisitors();
  const today = new Date().setHours(0, 0, 0, 0);

  // Check if this visitor ID has been tracked today
  return visitors.some(v => {
    const visitDate = new Date(v.timestamp).setHours(0, 0, 0, 0);
    return visitDate === today && localStorage.getItem(VISITOR_ID_KEY) === visitorId;
  });
}

// Track current visitor using ip-api.com (free tier: 45 requests/minute, no API key needed)
export async function trackVisitor(): Promise<VisitorLocation | null> {
  // Don't track if already tracked today
  if (hasTrackedToday()) {
    console.log('Visitor already tracked today');
    return null;
  }

  try {
    console.log('Fetching visitor location from ip-api.com...');
    const response = await fetch('http://ip-api.com/json/?fields=status,message,country,countryCode,city,lat,lon');

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response not OK:', response.status, errorText);
      throw new Error(`Failed to fetch location: ${response.status}`);
    }

    const data = await response.json();
    console.log('Location data received:', data);

    // Check if API returned an error
    if (data.status === 'fail') {
      console.error('API returned error:', data.message);
      throw new Error(data.message);
    }

    const location: VisitorLocation = {
      country: data.country || 'Unknown',
      countryCode: data.countryCode || 'XX',
      city: data.city || 'Unknown',
      lat: data.lat || 0,
      lon: data.lon || 0,
      timestamp: Date.now(),
    };

    addVisitor(location);
    console.log('Visitor tracked successfully:', location);
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
