import { Github, Linkedin, Mail, ArrowDown, Code2, GraduationCap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-20">
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 20%, var(--accent-soft) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-5xl mx-auto w-full relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 mb-12">
          <div className="hero-sub flex-shrink-0">
            <img
              src="/image/me.jpeg"
              alt="Nafis Fuad Shahid"
              className="w-48 h-48 rounded-full object-cover border-4 shadow-lg"
              style={{
                borderColor: 'var(--accent-blue)',
                animation: 'float 6s ease-in-out infinite',
              }}
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1
              className="hero-name text-5xl md:text-7xl font-light tracking-tight leading-none mb-6"
              style={{
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
              }}
            >
              Nafis Fuad Shahid
            </h1>

            <p
              className="hero-desc text-lg md:text-xl font-light max-w-2xl leading-relaxed mb-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              Software Engineer at Brain Station 23 | CSE '26 at IUT
            </p>

            <p
              className="hero-desc text-base font-light max-w-2xl leading-relaxed mb-8"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Building systems and doing research on federated learning and AI.
              Published at MIDL, ICSE, and other venues.
            </p>

            <div className="hero-links flex flex-wrap items-center justify-center md:justify-start gap-5">
              <a
                href="mailto:nafisfuad21@iut-dhaka.edu"
                className="link-underline text-sm transition-colors duration-300"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Mail size={14} />
                Email
              </a>
              <a
                href="https://github.com/NafisFuadShahid"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-sm transition-colors duration-300"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Github size={14} />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/nafisfuadshahid/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-sm transition-colors duration-300"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Linkedin size={14} />
                LinkedIn
              </a>
              <a
                href="https://scholar.google.com/citations?user=cRwM_j8AAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-sm transition-colors duration-300"
                style={{ color: 'var(--text-secondary)' }}
              >
                <GraduationCap size={14} />
                Scholar
              </a>
              <a
                href="https://codeforces.com/profile/NafiShahid"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-sm transition-colors duration-300"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Code2 size={14} />
                Codeforces
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 hero-links" style={{ animation: 'gentlePulse 3s ease-in-out infinite' }}>
        <div
          className="w-px h-16"
          style={{
            background: `linear-gradient(to bottom, transparent, var(--text-tertiary))`,
          }}
        />
        <ArrowDown size={16} style={{ color: 'var(--text-tertiary)' }} />
      </div>
    </section>
  );
}
