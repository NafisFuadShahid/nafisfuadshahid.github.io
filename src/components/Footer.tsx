import { Github, Linkedin, Mail, Code2, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="px-6 py-16"
      style={{ borderTop: `1px solid var(--border-color)` }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Nafis Fuad Shahid
          </div>
          <div className="flex items-center gap-5">
            <a
              href="mailto:nafisfuad21@iut-dhaka.edu"
              className="transition-colors duration-300"
              style={{ color: 'var(--text-tertiary)' }}
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
            <a
              href="https://github.com/NafisFuadShahid"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300"
              style={{ color: 'var(--text-tertiary)' }}
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/nafisfuadshahid/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300"
              style={{ color: 'var(--text-tertiary)' }}
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://scholar.google.com/citations?user=cRwM_j8AAAAJ&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300"
              style={{ color: 'var(--text-tertiary)' }}
              aria-label="Google Scholar"
            >
              <GraduationCap size={18} />
            </a>
            <a
              href="https://codeforces.com/profile/NafiShahid"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300"
              style={{ color: 'var(--text-tertiary)' }}
              aria-label="Codeforces"
            >
              <Code2 size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
