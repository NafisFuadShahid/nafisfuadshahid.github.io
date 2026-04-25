import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { trackVisitor, getVisitorsByCountry, getUniqueVisitorCount } from '../services/visitorTracking';

interface VisitorDot {
  name: string;
  lat: number;
  lon: number;
  count: number;
}

export default function VisitorGlobe() {
  const [visitors, setVisitors] = useState<VisitorDot[]>([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [rotation, setRotation] = useState(0);
  const rafRef = useRef<number>(0);

  // Load visitors and track current visitor
  useEffect(() => {
    const loadVisitors = () => {
      const visitorsByCountry = getVisitorsByCountry();
      const visitorDots: VisitorDot[] = [];

      visitorsByCountry.forEach((data, countryCode) => {
        visitorDots.push({
          name: `${data.city}, ${countryCode}`,
          lat: data.lat,
          lon: data.lon,
          count: data.count,
        });
      });

      setVisitors(visitorDots);
      setVisitorCount(getUniqueVisitorCount());
    };

    // Load existing visitors
    loadVisitors();

    // Track current visitor
    trackVisitor().then(() => {
      // Reload after tracking
      loadVisitors();
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 280;
    canvas.width = size;
    canvas.height = size;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.38;

    const isDark = theme === 'dark';
    const globeColor = isDark ? 'rgba(111, 168, 153, 0.08)' : 'rgba(90, 149, 133, 0.08)';
    const globeBorder = isDark ? 'rgba(111, 168, 153, 0.25)' : 'rgba(90, 149, 133, 0.3)';
    const dotColor = isDark ? '#c9b089' : '#b89968';
    const gridColor = isDark ? 'rgba(111, 168, 153, 0.12)' : 'rgba(90, 149, 133, 0.15)';

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      // Draw globe background
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = globeColor;
      ctx.fill();
      ctx.strokeStyle = globeBorder;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw latitude lines
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      for (let lat = -60; lat <= 60; lat += 30) {
        const y = centerY - (lat / 90) * radius;
        const latRadius = Math.cos((lat * Math.PI) / 180) * radius;

        ctx.beginPath();
        ctx.ellipse(centerX, y, latRadius, latRadius * 0.2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw longitude lines
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 + (rotation * Math.PI) / 180;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius * Math.abs(Math.cos(angle)), radius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw visitor location dots
      visitors.forEach((loc) => {
        const lon = ((loc.lon + rotation) % 360) - 180;

        // Only show dots on the visible hemisphere
        if (lon < -90 || lon > 90) return;

        const latRad = (loc.lat * Math.PI) / 180;
        const lonRad = (lon * Math.PI) / 180;

        const x = centerX + radius * Math.cos(latRad) * Math.sin(lonRad);
        const y = centerY - radius * Math.sin(latRad);

        // Dot size based on distance from edge (perspective)
        const distance = Math.abs(lonRad) / (Math.PI / 2);
        const dotSize = 4 * (1 - distance * 0.5);
        const opacity = 1 - distance * 0.3;

        // Draw glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, dotSize * 3);
        gradient.addColorStop(0, `${dotColor}${Math.floor(opacity * 0.6 * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, dotSize * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw dot
        ctx.fillStyle = `${dotColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      });

      // Rotate globe slowly
      setRotation((prev) => (prev + 0.15) % 360);
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [theme, rotation, visitors]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="drop-shadow-lg"
          style={{
            filter: 'drop-shadow(0 4px 20px rgba(90, 149, 133, 0.15))',
          }}
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          Global Visitors
        </p>
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {visitorCount > 0 ? `${visitorCount} ${visitorCount === 1 ? 'visitor' : 'visitors'} from ${visitors.length} ${visitors.length === 1 ? 'location' : 'locations'}` : 'Tracking visitors...'}
        </p>
      </div>
    </div>
  );
}
