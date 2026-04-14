import { useEffect, useRef } from 'react';
import { Briefcase, Code2, Shield } from 'lucide-react';

const experiences = [
  {
    role: 'Associate Software Engineer',
    company: 'Brain Station 23',
    period: 'Sep 2025 — Present',
    type: 'Full-time',
    color: '#60a5fa',
    bullets: [
      'Working on full-stack product development within an agile engineering team',
      'Contributing to scalable backend services and API design',
    ],
    skills: ['Engineering', 'Agile'],
  },
  {
    role: 'Junior Software Engineer',
    company: 'Inovace Technologies',
    period: 'Jun 2025 — Aug 2025',
    type: 'Full-time',
    color: '#34d399',
    bullets: [
      'Implemented a deduplication feature preventing duplicate sign-ins for employees with similar biometric data',
      'Developed the Guard Monitoring System — real-time security guard attendance and patrol tracking',
    ],
    skills: ['Biometrics', 'Real-time Systems', 'Backend'],
  },
];

const projects = [
  {
    name: 'MetaHive',
    subtitle: 'AI-Enhanced Virtual Workspace',
    desc: '2D virtual office platform with proximity-based audio/video, AI-powered document management via LangChain RAG, vector database search, and real-time collaboration.',
    stack: ['Spring Boot', 'Next.js', 'LangChain', 'Vector DB'],
    period: 'Dec 2024 — Jan 2025',
  },
  {
    name: 'ShopNSwap',
    subtitle: 'Location-Based Marketplace',
    desc: 'Ecommerce platform with geolocation-based recommendations, trading mechanisms, and personalized UX optimization using Google Geolocation API.',
    stack: ['Node.js', 'React', 'Geo API'],
    period: 'Oct 2024 — Dec 2024',
  },
  {
    name: 'FarmVitals',
    subtitle: 'Smart Farm Disease Detection',
    desc: 'AI-driven CNN application for assessing health of farm animals and plants by analyzing uploaded images for disease detection.',
    stack: ['TensorFlow', 'CNN', 'Tkinter'],
    period: 'May 2024 — Jul 2024',
  },
  {
    name: 'MunchMate',
    subtitle: 'Food Delivery Platform',
    desc: 'Food delivery app with reservation system and interactive map displaying restaurant locations.',
    stack: ['React Native'],
    period: 'Apr 2024 — Jun 2024',
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
    <section id="career" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div
          ref={(el) => { itemRefs.current[0] = el; }}
          className="reveal mb-16"
        >
          <span className="section-label" style={{ color: '#60a5fa' }}>
            Professional Career
          </span>
          <h2
            className="text-4xl md:text-5xl font-light mt-3 tracking-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            Work Experience
          </h2>
        </div>

        <div className="relative mb-24">
          <div
            className="absolute left-[7px] top-0 bottom-0 w-px timeline-line"
            style={{ background: 'linear-gradient(to bottom, rgba(96,165,250,0.4), rgba(96,165,250,0.05))' }}
          />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <div
                key={exp.role}
                ref={(el) => { itemRefs.current[i + 1] = el; }}
                className={`reveal reveal-delay-${i + 1} relative pl-10`}
              >
                <div
                  className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#080808]"
                  style={{ background: exp.color, boxShadow: `0 0 0 4px ${exp.color}20` }}
                />

                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-medium" style={{ color: exp.color }}>
                        {exp.company}
                      </span>
                      <span className="text-white/20">·</span>
                      <span className="text-xs text-white/40">{exp.type}</span>
                    </div>
                  </div>
                  <span
                    className="badge text-xs"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {exp.period}
                  </span>
                </div>

                <ul className="space-y-2 mb-4">
                  {exp.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-white/50 leading-relaxed">
                      <span
                        className="mt-2 w-1 h-1 rounded-full flex-shrink-0"
                        style={{ background: exp.color, opacity: 0.5 }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((s) => (
                    <span
                      key={s}
                      className="badge"
                      style={{
                        background: `${exp.color}0d`,
                        border: `1px solid ${exp.color}20`,
                        color: exp.color,
                        opacity: 0.9,
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

        <div
          ref={(el) => { itemRefs.current[experiences.length + 1] = el; }}
          className="reveal mb-8"
        >
          <h3 className="text-2xl font-light text-white/80" style={{ letterSpacing: '-0.01em' }}>
            Selected Projects
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((proj, i) => (
            <div
              key={proj.name}
              ref={(el) => { itemRefs.current[experiences.length + 2 + i] = el; }}
              className={`reveal reveal-delay-${(i % 3) + 1} card-hover rounded-xl p-6 border`}
              style={{
                borderColor: 'rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.018)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Code2 size={13} className="text-white/30" />
                    <h4 className="text-sm font-semibold text-white">{proj.name}</h4>
                  </div>
                  <p className="text-xs text-white/35 mt-0.5">{proj.subtitle}</p>
                </div>
                <span className="text-xs text-white/25 whitespace-nowrap">{proj.period}</span>
              </div>
              <p className="text-sm text-white/45 leading-relaxed mb-4">{proj.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {proj.stack.map((s) => (
                  <span
                    key={s}
                    className="badge"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      color: 'rgba(255,255,255,0.4)',
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
          ref={(el) => { itemRefs.current[experiences.length + projects.length + 2] = el; }}
          className="reveal mt-10 rounded-2xl p-6 border"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
        >
          <h4 className="text-xs font-semibold text-white/40 mb-4" style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Technical Skills
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Languages', items: 'Python · JavaScript · TypeScript · C++ · Java' },
              { label: 'Frontend', items: 'React · React Native · Tailwind CSS' },
              { label: 'Backend', items: 'Node.js · Express.js · Spring Boot · REST APIs' },
              { label: 'AI / ML', items: 'TensorFlow · LangChain · LangGraph · OpenCV' },
              { label: 'Databases', items: 'PostgreSQL · MySQL · MongoDB' },
              { label: 'Tools', items: 'Git · Docker · Microservices · Redis' },
            ].map((group) => (
              <div key={group.label}>
                <div className="text-xs text-white/35 mb-1">{group.label}</div>
                <div className="text-xs text-white/60 leading-relaxed">{group.items}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
