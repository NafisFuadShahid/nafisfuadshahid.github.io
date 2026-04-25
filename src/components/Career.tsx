import { useEffect, useRef } from 'react';
import FlipCard from './FlipCard';

const experiences = [
  {
    role: 'Associate Software Engineer',
    company: 'Brain Station 23',
    companyUrl: 'https://brainstation-23.com/',
    period: 'Sep 2025 — Present',
    type: 'Full-time',
    color: '#60a5fa',
    bullets: [
      'Full-stack development on fintech team',
      
    ],
    skills: ['Backend', 'APIs'],
    focus: 'Spring Boot, Microservices, Distributed Systems, API Design, Agentic RAG, MCP',
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map((exp, i) => {
            // Front: Role, company, period
            const front = (
              <div className="flex flex-col justify-between h-full min-h-[240px]">
                <div>
                  <div
                    className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${exp.color}22 0%, ${exp.color}11 100%)`,
                      border: `1.5px solid ${exp.color}33`,
                    }}
                  >
                    <span style={{ fontSize: '20px', color: exp.color }}>💼</span>
                  </div>

                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
                  >
                    {exp.role}
                  </h3>

                  <a
                    href={exp.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:underline inline-block mb-3"
                    style={{ color: 'var(--accent-primary)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {exp.company}
                  </a>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className="badge text-xs"
                      style={{
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {exp.period}
                    </span>
                    <span
                      className="badge text-xs"
                      style={{
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      {exp.type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--accent-primary)' }}>
                  <span>Click for details</span>
                  <span style={{ fontSize: '14px' }}>→</span>
                </div>
              </div>
            );

            // Back: Responsibilities, focus, skills
            const back = (
              <div className="flex flex-col justify-between h-full min-h-[240px]">
                <div>
                  <ul className="space-y-2.5 mb-4">
                    {exp.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2.5 text-sm leading-relaxed"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: 'var(--accent-primary)' }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="mb-4 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="text-xs font-medium block mb-2" style={{ color: 'var(--text-tertiary)' }}>
                      Focus Areas
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {exp.focus}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((s) => (
                      <span
                        key={s}
                        className="badge text-xs"
                        style={{
                          background: 'var(--accent-soft)',
                          color: 'var(--accent-soft-text)',
                          padding: '4px 12px',
                        }}
                      >
                        {s}
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
                key={exp.role}
                ref={(el) => { itemRefs.current[i + 1] = el; }}
                className={`reveal reveal-delay-${i + 1}`}
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
