import { ReactNode, useState } from 'react';

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  className?: string;
}

export default function FlipCard({ front, back, className = '' }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`flip-card-container ${isFlipped ? 'flipped' : ''} ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsFlipped(!isFlipped);
        }
      }}
      aria-label={isFlipped ? 'Click to flip back' : 'Click to flip card'}
    >
      <div className="flip-card-inner">
        {/* Front Face */}
        <div
          className="flip-card-face flip-card-front"
          style={{
            background: 'var(--bg-secondary)',
            border: '1.5px solid var(--border-color)',
            padding: '24px',
          }}
        >
          {front}
        </div>

        {/* Back Face */}
        <div
          className="flip-card-face flip-card-back"
          style={{
            background: 'var(--bg-secondary)',
            border: '1.5px solid var(--border-color)',
            padding: '24px',
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
