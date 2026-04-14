import { useEffect, useRef } from 'react';
import { Trophy, Star, Users, Zap } from 'lucide-react';

const competitions = [
  {
    title: 'Champion of Champions',
    event: 'Geeky Solutions Learnathon 3.0',
    year: '2024',
    highlights: [
      'Java Stack Champion — selected from 3,000+ applicants',
      'Named Champion of Champions among 7 stack category winners',
      'Overall winner across all competitive programming stacks',
    ],
    tags: ['Champion', 'Java Stack'],
    icon: Trophy,
    accentColor: '#f59e0b',
    bgAccent: 'rgba(245, 158, 11, 0.06)',
    borderAccent: 'rgba(245, 158, 11, 0.12)',
  },
  {
    title: 'Top 10 Finalist',
    event: 'Vivasoft AI Hackathon 2025',
    year: '2025',
    highlights: [
      'Reached finals among 500+ participating teams',
      'Youngest team to qualify for the final round',
      'Competed in AI/ML solution building under time constraints',
    ],
    tags: ['Top 10', 'AI Hackathon'],
    icon: Zap,
    accentColor: '#60a5fa',
    bgAccent: 'rgba(96, 165, 250, 0.06)',
    borderAccent: 'rgba(96, 165, 250, 0.12)',
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
      className="py-32 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <div className="reveal mb-16">
          <span className="section-label" style={{ color: '#f59e0b' }}>
            Competitions
          </span>
          <h2
            className="text-4xl md:text-5xl font-light mt-3 tracking-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            Awards &amp; Achievements
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {competitions.map((comp, i) => {
            const Icon = comp.icon;
            return (
              <div
                key={comp.title}
                ref={(el) => { itemRefs.current[i] = el; }}
                className="reveal card-hover rounded-2xl p-8 border"
                style={{
                  borderColor: comp.borderAccent,
                  background: comp.bgAccent,
                  transitionDelay: `${i * 0.08}s`,
                }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `rgba(${comp.accentColor === '#f59e0b' ? '245,158,11' : '96,165,250'}, 0.12)` }}
                  >
                    <Icon size={18} style={{ color: comp.accentColor }} />
                  </div>
                  <span
                    className="badge"
                    style={{
                      background: `rgba(${comp.accentColor === '#f59e0b' ? '245,158,11' : '96,165,250'}, 0.08)`,
                      border: `1px solid ${comp.borderAccent}`,
                      color: comp.accentColor,
                    }}
                  >
                    {comp.year}
                  </span>
                </div>

                <div className="mb-1">
                  <span
                    className="text-xs font-medium"
                    style={{ color: comp.accentColor, letterSpacing: '0.05em' }}
                  >
                    {comp.event}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-5">
                  {comp.title}
                </h3>

                <ul className="space-y-2.5">
                  {comp.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-3 text-sm text-white/55 leading-relaxed"
                    >
                      <span
                        className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                        style={{ background: comp.accentColor, opacity: 0.6 }}
                      />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {comp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="badge"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.45)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="reveal reveal-delay-3 mt-8 rounded-2xl p-6 border flex flex-wrap gap-8" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          {[
            { icon: Trophy, value: '1st', label: 'Overall Champion', color: '#f59e0b' },
            { icon: Users, value: '3,000+', label: 'Competitors Defeated', color: '#60a5fa' },
            { icon: Star, value: 'Top 10', label: 'AI Hackathon 2025', color: '#34d399' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-4">
                <Icon size={16} style={{ color: stat.color, opacity: 0.7 }} />
                <div>
                  <div className="text-lg font-semibold text-white">{stat.value}</div>
                  <div className="text-xs text-white/40">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
