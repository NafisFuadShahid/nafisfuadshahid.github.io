import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after a short delay
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 1200);

    // Remove from DOM after fade animation completes
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1800);

    // Also fade out on scroll
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setFadeOut(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 pointer-events-none"
      style={{
        background: 'var(--bg-primary)',
        opacity: fadeOut ? 0 : 1,
      }}
    >
      <div
        className="text-center"
        style={{
          animation: 'fadeInBlur 0.8s ease-out',
        }}
      >
        <div
          className="text-6xl md:text-8xl font-light tracking-tight"
          style={{
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
          }}
        >
          NFS
        </div>
        <div
          className="mt-4 w-16 h-0.5 mx-auto"
          style={{
            background: 'var(--accent-blue)',
            animation: 'slideUpFade 0.6s ease-out 0.3s backwards',
          }}
        />
      </div>
    </div>
  );
}
