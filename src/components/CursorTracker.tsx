import { useEffect, useRef, useState } from 'react';

export default function CursorTracker() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mouse   = useRef({ x: -300, y: -300 });
  const dotPos  = useRef({ x: -300, y: -300 });
  const ringPos = useRef({ x: -300, y: -300 });
  const raf     = useRef<number>(0);

  const [isTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
  );

  useEffect(() => {
    if (isTouch) return;

    document.body.style.cursor = 'none';

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      dotPos.current.x  = lerp(dotPos.current.x,  mouse.current.x, 0.38);
      dotPos.current.y  = lerp(dotPos.current.y,  mouse.current.y, 0.38);
      ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.09);
      ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.09);

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(calc(${dotPos.current.x}px - 50%), calc(${dotPos.current.y}px - 50%))`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(calc(${ringPos.current.x}px - 50%), calc(${ringPos.current.y}px - 50%))`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      {/* Fast dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: 6, height: 6,
          borderRadius: '50%',
          background: 'var(--accent-blue)',
          willChange: 'transform',
          mixBlendMode: 'screen',
        }}
      />

      {/* Lagged ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          width: 38, height: 38,
          borderRadius: '50%',
          border: '1.5px solid rgba(54,169,244,0.38)',
          willChange: 'transform',
        }}
      />
    </>
  );
}