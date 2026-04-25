import { useEffect, useRef } from 'react';
import { Trophy, Zap } from 'lucide-react';
import FlipCard from './FlipCard';

const competitions = [
  {
    title: 'Learnathon 3.0',
    event: 'Geeky Solutions',
    year: '2024',
    highlights: [
      'Won the Java stack category',
      'Overall champion across all tracks',
    ],
    tags: ['Java'],
    icon: Trophy,
    image: `${import.meta.env.BASE_URL}image/comp1.jpeg`,
  },
  {
    title: 'AI Hackathon',
    event: 'Vivasoft',
    year: '2025',
    highlights: [
      'Made it to top 10',
    ],
    tags: ['AI/ML'],
    icon: Zap,
    image: `${import.meta.env.BASE_URL}image/comp2.jpeg`,
  },
];

export default function Competitions() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const section = sectionRef.current;
    if (section) observer.observe(section);
    itemRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="competitions"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-24 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <div className="reveal mb-12">
          <h2
            className="text-4xl md:text-5xl font-light tracking-tight"
            style={{
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            Competitions
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {competitions.map((comp, i) => {
            const Icon = comp.icon;

            // Front: Image with title overlay
            const front = (
              <div className="flex flex-col h-full min-h-[320px]">
                <div className="relative h-48 -m-6 mb-4 overflow-hidden">
                  <img
                    src={comp.image}
                    alt={comp.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                    }}
                  />
                  <div className="absolute bottom-4 left-6 right-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={18} style={{ color: 'white' }} aria-hidden="true" />
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                        {comp.year}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className="text-xl font-semibold mb-3"
                      style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
                    >
                      {comp.title}
                    </h3>
                    <span className="text-sm" style={{ color: 'var(--accent-primary)' }}>
                      {comp.event}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--accent-primary)' }}>
                    <span>Click for details</span>
                    <span style={{ fontSize: '14px' }}>→</span>
                  </div>
                </div>
              </div>
            );

            // Back: Highlights and tags
            const back = (
              <div className="flex flex-col justify-between h-full min-h-[320px]">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Icon size={20} style={{ color: 'var(--accent-primary)' }} aria-hidden="true" />
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {comp.title}
                    </h3>
                  </div>

                  <div className="mb-5 pb-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="text-xs font-medium block mb-2" style={{ color: 'var(--text-tertiary)' }}>
                      Achievements
                    </span>
                    <ul className="space-y-2.5">
                      {comp.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex items-start gap-2.5 text-sm leading-relaxed"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          <span
                            className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: 'var(--accent-primary)' }}
                          />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {comp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="badge text-xs"
                        style={{
                          background: 'var(--accent-soft)',
                          color: 'var(--accent-soft-text)',
                          padding: '4px 12px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs" style={{ color: 'var(--accent-primary)' }}>
                  Click to flip back
                </div>
              </div>
            );

            return (
              <div
                key={comp.title}
                ref={(el) => { itemRefs.current[i] = el; }}
                className="reveal"
                style={{
                  transitionDelay: `${i * 0.1}s`,
                }}
              >
                <FlipCard front={front} back={back} className="card-glow" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
