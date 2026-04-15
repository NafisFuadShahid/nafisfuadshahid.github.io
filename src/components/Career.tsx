import { useEffect, useRef } from 'react';

const experiences = [
  {
    role: 'Associate Software Engineer',
    company: 'Brain Station 23',
    companyUrl: 'https://brainstation-23.com/',
    period: 'Sep 2025 — Present',
    type: 'Full-time',
    color: '#60a5fa',
    bullets: [
      'Full-stack development on fintech teams',
      
    ],
    skills: ['Backend', 'APIs'],
    focus: 'Microservices, distributed systems, API architecture',
  },
  {
    role: 'Junior Software Engineer',
    company: 'Inovace Technologies',
    companyUrl: 'https://inovacetech.com/',
    period: 'Jun 2025 — Aug 2025',
    type: 'Full-time',
    color: '#34d399',
    bullets: [
      'Built deduplication system for biometric attendance to handle similar employee data',
      'Developed guard monitoring system for real-time security patrol tracking',
    ],
    skills: ['Biometrics', 'Real-time'],
    focus: 'Real-time systems, biometric authentication, IoT',
  },
];

export default function Career() {
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08 }
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="career" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div
          ref={(el) => { itemRefs.current[0] = el; }}
          className="reveal mb-12"
        >
          <h2
            className="text-4xl md:text-5xl font-light tracking-tight"
            style={{
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            Work
          </h2>
        </div>

        <div className="relative mb-20">
          <div
            className="absolute left-[7px] top-0 bottom-0 w-px timeline-line"
            style={{
              background: `linear-gradient(to bottom, var(--accent-blue), var(--border-color))`,
            }}
          />

          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <div
                key={exp.role}
                ref={(el) => { itemRefs.current[i + 1] = el; }}
                className={`reveal reveal-delay-${i + 1} relative pl-10`}
              >
                <div
                  className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2"
                  style={{
                    background: 'var(--accent-blue)',
                    borderColor: 'var(--bg-primary)',
                    boxShadow: `0 0 0 4px var(--bg-tertiary)`,
                  }}
                />

                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <a
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:underline"
                        style={{ color: 'var(--accent-blue)' }}
                      >
                        {exp.company}
                      </a>
                      <span style={{ color: 'var(--text-tertiary)' }}>·</span>
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {exp.type}
                      </span>
                    </div>
                  </div>
                  <span
                    className="badge text-xs"
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: `1px solid var(--border-color)`,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {exp.period}
                  </span>
                </div>

                <ul className="space-y-2.5 mb-3">
                  {exp.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span
                        className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: 'var(--accent-sage)' }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="mb-4">
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Focus: {exp.focus}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((s) => (
                    <span
                      key={s}
                      className="badge"
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: `1px solid var(--border-color)`,
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
