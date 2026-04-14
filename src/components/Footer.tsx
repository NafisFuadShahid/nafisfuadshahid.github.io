import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="px-6 py-12"
      style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="text-sm font-medium text-white/60">Nafis Fuad Shahid</div>
          <div className="text-xs text-white/25 mt-1">
            BSc Computer Science & Engineering · IUT Bangladesh
          </div>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="mailto:nafisfuad21@iut-dhaka.edu"
            className="text-white/30 hover:text-white/70 transition-colors duration-200"
            aria-label="Email"
          >
            <Mail size={15} />
          </a>
          <a
            href="https://github.com/NafisFuadShahid"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/30 hover:text-white/70 transition-colors duration-200"
            aria-label="GitHub"
          >
            <Github size={15} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/30 hover:text-white/70 transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <Linkedin size={15} />
          </a>
        </div>
      </div>
    </footer>
  );
}
