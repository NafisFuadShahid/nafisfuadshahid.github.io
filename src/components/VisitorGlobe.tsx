import { useEffect, useState, useRef } from 'react';
import Globe from 'react-globe.gl';
import { useTheme } from '../context/ThemeContext';
import { trackVisitor, getVisitorsByCountry, getUniqueVisitorCount } from '../services/visitorTracking';

interface VisitorDot {
  name: string;
  lat: number;
  lng: number;
  count: number;
  size: number;
  color: string;
}

export default function VisitorGlobe() {
  const [visitors, setVisitors] = useState<VisitorDot[]>([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [isTracking, setIsTracking] = useState(true);
  const { theme } = useTheme();
  const globeEl = useRef<any>();

  // Load visitors and track current visitor
  useEffect(() => {
    const loadVisitors = () => {
      const visitorsByCountry = getVisitorsByCountry();
      const visitorDots: VisitorDot[] = [];

      const isDark = theme === 'dark';
      const dotColor = isDark ? '#c9b089' : '#b89968';

      visitorsByCountry.forEach((data, countryCode) => {
        visitorDots.push({
          name: `${data.city}, ${countryCode}`,
          lat: data.lat,
          lng: data.lon,
          count: data.count,
          size: 0.8,
          color: dotColor,
        });
      });

      setVisitors(visitorDots);
      setVisitorCount(getUniqueVisitorCount());
    };

    // Load existing visitors immediately
    loadVisitors();

    // Track current visitor
    trackVisitor()
      .then((result) => {
        console.log('Visitor tracking result:', result);
        // Reload after tracking
        loadVisitors();
      })
      .catch((error) => {
        console.error('Tracking error:', error);
      })
      .finally(() => {
        setIsTracking(false);
      });
  }, []);

  // Update dot colors and globe appearance when theme changes
  useEffect(() => {
    const isDark = theme === 'dark';
    const dotColor = isDark ? '#c9b089' : '#b89968';

    setVisitors(prev => prev.map(v => ({ ...v, color: dotColor })));

    // Update globe material color
    if (globeEl.current) {
      const globeMaterial = globeEl.current.globeMaterial();
      if (globeMaterial) {
        globeMaterial.color.set(isDark ? '#1a1816' : '#f5f3f0');
      }
    }
  }, [theme]);

  // Auto-rotate globe
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.3;
      globeEl.current.controls().enableZoom = false;
    }
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: '100%', maxWidth: '350px', height: '350px' }}>
        <Globe
          ref={globeEl}
          backgroundColor="rgba(0,0,0,0)"

          showGlobe={true}
          showAtmosphere={true}
          atmosphereColor={isDark ? '#6fa899' : '#5a9585'}
          atmosphereAltitude={0.12}

          globeImageUrl={null as any}
          bumpImageUrl={null as any}

          onGlobeReady={(globe: any) => {
            const globeMaterial = globe.globeMaterial();
            globeMaterial.color.set(isDark ? '#1a1816' : '#f5f3f0');
            globeMaterial.opacity = 0.9;
            globeMaterial.transparent = true;
          }}

          pointsData={visitors}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointAltitude={0.015}
          pointRadius="size"
          pointLabel={(d: any) => `
            <div style="
              background: ${isDark ? 'rgba(42, 38, 34, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
              color: ${isDark ? '#e8ecef' : '#2a2622'};
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 12px;
              font-family: Inter, sans-serif;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            ">
              <strong>${d.name}</strong>
              ${d.count > 1 ? `<br/>${d.count} visitors` : ''}
            </div>
          `}

          width={350}
          height={350}
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          Global Visitors
        </p>
        <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>
          {isTracking && visitorCount === 0
            ? 'Loading...'
            : visitorCount > 0
            ? `${visitorCount} ${visitorCount === 1 ? 'visitor' : 'visitors'} from ${visitors.length} ${visitors.length === 1 ? 'country' : 'countries'}`
            : 'Be the first visitor!'}
        </p>
        {visitors.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {visitors.map((v) => (
              <span
                key={v.name}
                className="text-xs px-3 py-1"
                style={{
                  color: 'var(--accent-primary)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '12px',
                }}
              >
                {v.name} {v.count > 1 ? `(${v.count})` : ''}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
