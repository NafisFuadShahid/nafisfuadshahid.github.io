import { useEffect, useRef } from 'react';
import { Trophy, Zap } from 'lucide-react';

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
            return (
              <div
                key={comp.title}
                ref={(el) => { itemRefs.current[i] = el; }}
                className="reveal card-hover"
                style={{
                  transitionDelay: `${i * 0.1}s`,
                }}
              >
                <div className="relative h-56 overflow-hidden rounded-lg mb-4">
                  <img
                    src={comp.image}
                    alt={comp.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className="text-xl font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {comp.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Icon size={16} style={{ color: 'var(--text-tertiary)' }} aria-hidden="true" />
                      <span
                        className="text-sm"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        {comp.year}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span
                      className="text-sm"
                      style={{
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {comp.event}
                    </span>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {comp.highlights.map((h) => (
                      <li
                        key={h}
                        className="text-sm leading-relaxed"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {comp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs"
                        style={{
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
