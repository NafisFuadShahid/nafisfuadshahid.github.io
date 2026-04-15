import { useEffect, useRef } from 'react';

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

export default function Projects() {
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
    <section id="projects" className="py-24 px-6 pb-32">
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
            Projects
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((proj, i) => (
            <div
              key={proj.name}
              ref={(el) => { itemRefs.current[i + 1] = el; }}
              className={`reveal reveal-delay-${(i % 3) + 1} card-hover pb-4 border-b`}
              style={{
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4
                  className="text-base font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {proj.name}
                </h4>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {proj.period}
                </span>
              </div>
              <p className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>
                {proj.subtitle}
              </p>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                {proj.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {proj.stack.map((s) => (
                  <span
                    key={s}
                    className="text-xs"
                    style={{
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

        <div
          ref={(el) => { itemRefs.current[projects.length + 1] = el; }}
          className="reveal mt-12 pt-8 border-t"
          style={{
            borderColor: 'var(--border-color)',
          }}
        >
          <h4
            className="text-sm font-medium mb-6"
            style={{
              color: 'var(--text-primary)',
            }}
          >
            Skills
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Languages', items: 'Python, JavaScript, TypeScript, C++, Java' },
              { label: 'Backend', items: 'Node.js, Express, Spring Boot' },
              { label: 'AI/ML', items: 'TensorFlow, LangChain, OpenCV' },
              { label: 'Databases', items: 'PostgreSQL, MySQL, MongoDB' },
            ].map((group) => (
              <div key={group.label}>
                <span
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span style={{ color: 'var(--text-primary)' }}>{group.label}:</span> {group.items}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
