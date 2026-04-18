import { useEffect, useRef } from 'react';
import FlipCard from './FlipCard';

const projects = [
  {
    name: 'MetaHive',
    subtitle: 'Virtual workspace',
    desc: '2D office platform with proximity-based voice/video and AI document search using LangChain.',
    stack: ['Spring Boot', 'Next.js', 'LangChain'],
    period: 'Dec 2024',
  },
  {
    name: 'ShopNSwap',
    subtitle: 'Marketplace',
    desc: 'Ecommerce platform with location-based recommendations.',
    stack: ['Node.js', 'React'],
    period: 'Oct 2024',
  },
  {
    name: 'FarmVitals',
    subtitle: 'Disease detection',
    desc: 'CNN-based health assessment for farm animals and plants.',
    stack: ['TensorFlow', 'Tkinter'],
    period: 'May 2024',
  },
  {
    name: 'MunchMate',
    subtitle: 'Food delivery',
    desc: 'Delivery app with restaurant map and reservations.',
    stack: ['React Native'],
    period: 'Apr 2024',
  },
];

// ─── Sub-component with flip card ───
function ProjectCard({
  proj,
  index,
  observeRef,
}: {
  proj: (typeof projects)[0];
  index: number;
  observeRef: (el: HTMLDivElement | null) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const setRef = (el: HTMLDivElement | null) => {
    (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    observeRef(el);
  };

  // Front: Name, subtitle, period
  const front = (
    <div className="flex flex-col justify-between h-full min-h-[200px]">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs px-3 py-1"
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-tertiary)',
              borderRadius: '12px',
            }}
          >
            {proj.period}
          </span>
        </div>

        <h4
          className="text-xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
        >
          {proj.name}
        </h4>

        <p className="text-sm mb-4" style={{ color: 'var(--accent-primary)' }}>
          {proj.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--accent-primary)' }}>
        <span>Click for details</span>
        <span style={{ fontSize: '14px' }}>→</span>
      </div>
    </div>
  );

  // Back: Description and tech stack
  const back = (
    <div className="flex flex-col justify-between h-full min-h-[200px]">
      <div>
        <p
          className="text-sm leading-relaxed mb-5 pb-5 border-b"
          style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}
        >
          {proj.desc}
        </p>

        <div>
          <span className="text-xs font-medium block mb-3" style={{ color: 'var(--text-tertiary)' }}>
            Tech Stack
          </span>
          <div className="flex flex-wrap gap-2">
            {proj.stack.map((s) => (
              <span
                key={s}
                className="badge text-xs"
                style={{
                  background: 'var(--accent-soft)',
                  color: 'var(--text-primary)',
                  padding: '4px 12px',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs" style={{ color: 'var(--accent-primary)' }}>
        Click to flip back
      </div>
    </div>
  );

  return (
    <div ref={setRef} className={`reveal reveal-delay-${(index % 3) + 1}`}>
      <FlipCard front={front} back={back} className="card-glow" />
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────
export default function Projects() {
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.08 }
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="py-24 px-6 pb-32">
      <div className="max-w-5xl mx-auto">
        <div
          ref={(el) => { itemRefs.current[0] = el; }}
          className="reveal mb-12"
        >
          <h2
            className="text-4xl md:text-5xl font-light tracking-tight"
            style={{ letterSpacing: '-0.02em', color: 'var(--text-primary)' }}
          >
            Projects
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((proj, i) => (
            <ProjectCard
              key={proj.name}
              proj={proj}
              index={i}
              observeRef={(el) => { itemRefs.current[i + 1] = el; }}
            />
          ))}
        </div>

        <div
          ref={(el) => { itemRefs.current[projects.length + 1] = el; }}
          className="reveal mt-12 pt-8 border-t"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <h4 className="text-sm font-medium mb-6" style={{ color: 'var(--text-primary)' }}>
            Skills
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Languages', items: 'Python, JavaScript, TypeScript, C++, Java' },
              { label: 'Backend',   items: 'Node.js, Express, Spring Boot' },
              { label: 'AI/ML',     items: 'TensorFlow, LangChain, OpenCV' },
              { label: 'Databases', items: 'PostgreSQL, MySQL, MongoDB' },
            ].map((group) => (
              <div key={group.label}>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{group.label}:</span>{' '}
                  {group.items}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}