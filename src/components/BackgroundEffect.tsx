import { useEffect, useRef } from 'react';

export default function BackgroundEffect() {
  const auraRef   = useRef<HTMLDivElement>(null);
  const target    = useRef({ x: 0.5, y: 0.3 });
  const current   = useRef({ x: 0.5, y: 0.3 });
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.022);
      current.current.y = lerp(current.current.y, target.current.y, 0.022);

      if (auraRef.current) {
        const x = (current.current.x * 100).toFixed(2);
        const y = (current.current.y * 100).toFixed(2);
        auraRef.current.style.background =
          `radial-gradient(ellipse 65% 52% at ${x}% ${y}%, var(--aura-color), transparent 68%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Ambient gradients for day mode */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: 'var(--ambient-gradient-1)',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: 'var(--ambient-gradient-2)',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: 'var(--ambient-gradient-3)',
        }}
      />

      {/* Mouse-following aura */}
      <div
        ref={auraRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Noise grain */}
      <div
        className="noise-grain fixed inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />
    </>
  );
}