import { useRef } from 'react';
import { Github, Linkedin, Mail, ArrowDown, Code2, GraduationCap } from 'lucide-react';

export default function Hero() {
  const photoRef = useRef<HTMLDivElement>(null);

  const onPhotoMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = photoRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2);
    const ny = (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2);
    el.style.transition = 'transform 0.08s ease-out';
    el.style.transform  = `perspective(700px) rotateX(${-ny * 10}deg) rotateY(${nx * 10}deg) scale(1.04)`;
  };

  const onPhotoLeave = () => {
    const el = photoRef.current;
    if (!el) return;
    el.style.transition = 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)';
    el.style.transform  = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-20">
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 20%, var(--accent-soft) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-5xl mx-auto w-full relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 mb-12">

          {/* ─── Profile photo with 3-D tilt ─── */}
          <div
            ref={photoRef}
            className="hero-sub flex-shrink-0 tilt-card"
            onMouseMove={onPhotoMove}
            onMouseLeave={onPhotoLeave}
            style={{ willChange: 'transform' }}
          >
            <img
              src={`${import.meta.env.BASE_URL}image/me.jpeg`}
              alt="Nafis Fuad Shahid"
              className="w-48 h-48 rounded-full object-cover border-4 shadow-lg"
              style={{
                borderColor: 'var(--accent-blue)',
                animation: 'float 3.5s ease-in-out infinite',
                pointerEvents: 'none',
              }}
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1
              className="hero-name text-5xl md:text-7xl font-light tracking-tight leading-none mb-6"
              style={{ letterSpacing: '-0.02em', color: 'var(--text-primary)' }}
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
              Building systems and doing research on federated learning and Medical Imaging.
            </p>

            {/* ─── Links with press + glow ─── */}
            <div className="hero-links flex flex-wrap items-center justify-center md:justify-start gap-5">
              {[
                { href: 'mailto:nafisfuad21@iut-dhaka.edu', icon: <Mail size={14} />,        label: 'Email'      },
                { href: 'https://github.com/NafisFuadShahid',            icon: <Github size={14} />,      label: 'GitHub'     },
                { href: 'https://www.linkedin.com/in/nafisfuadshahid/',   icon: <Linkedin size={14} />,    label: 'LinkedIn'   },
                { href: 'https://scholar.google.com/citations?user=cRwM_j8AAAAJ&hl=en',
                                                                           icon: <GraduationCap size={14} />, label: 'Scholar'  },
                { href: 'https://codeforces.com/profile/NafiShahid',      icon: <Code2 size={14} />,       label: 'Codeforces' },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="link-underline link-glow btn-press text-sm"
                  style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  {icon}
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 hero-links"
        style={{ animation: 'gentlePulse 2s ease-in-out infinite' }}
      >
        <div
          className="w-px h-16"
          style={{ background: `linear-gradient(to bottom, transparent, var(--text-tertiary))` }}
        />
        <ArrowDown size={16} style={{ color: 'var(--text-tertiary)' }} />
      </div>
    </section>
  );
}