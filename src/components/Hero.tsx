import { Github, Linkedin, Mail, ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-20">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(96,165,250,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-5xl mx-auto w-full relative z-10">
        <div className="mb-3 hero-sub">
          <span
            className="section-label"
            style={{ color: '#60a5fa' }}
          >
            Portfolio
          </span>
        </div>

        <h1
          className="hero-name text-6xl md:text-8xl font-light tracking-tight leading-none mb-6"
          style={{ letterSpacing: '-0.03em' }}
        >
          Nafis Fuad
          <br />
          <span className="text-white/35">Shahid</span>
        </h1>

        <p className="hero-desc text-base md:text-lg text-white/45 font-light max-w-lg leading-relaxed mb-10">
          Software Engineer & Researcher at IUT Bangladesh.
          Building intelligent systems at the intersection of
          federated learning, NLP, and distributed computing.
        </p>

        <div className="hero-links flex flex-wrap items-center gap-6">
          <a
            href="mailto:nafisfuad21@iut-dhaka.edu"
            className="link-underline text-sm text-white/50 hover:text-white/90 transition-colors duration-200"
          >
            <Mail size={13} />
            nafisfuad21@iut-dhaka.edu
          </a>
          <a
            href="https://github.com/NafisFuadShahid"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-sm text-white/50 hover:text-white/90 transition-colors duration-200"
          >
            <Github size={13} />
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-sm text-white/50 hover:text-white/90 transition-colors duration-200"
          >
            <Linkedin size={13} />
            LinkedIn
          </a>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hero-links">
        <div
          className="w-px h-16"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.15))',
          }}
        />
        <ArrowDown size={14} className="text-white/25" />
      </div>
    </section>
  );
}
