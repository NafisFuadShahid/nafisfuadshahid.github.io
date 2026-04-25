import { useEffect, useRef } from 'react';
import FlipCard from './FlipCard';

const papers = [
  {
    title: 'Probabilistic Feature Imputation and Uncertainty-Aware Multimodal Federated Aggregation',
    venue: 'MIDL', location: 'Taiwan', year: '2026',
    authors: 'Nafis Fuad Shahid, Maroof Ahmed*, Md Akib Haider*, Saidur Rahman Sagor, Aashnan Rahman, Md Azam Hossain',
    abstract: 'PFIN handles missing modalities in federated medical imaging by using probabilistic distributions instead of point estimates. Our uncertainty-aware aggregation method improved AUC by 5.36% on chest X-ray classification when modalities are missing.',
    tags: ['Federated Learning', 'Medical Imaging'],
    pdf: `${import.meta.env.BASE_URL}papers/midl26_335.pdf`,
    github: 'https://github.com/NafisFuadShahid/PFIN-UQAVG',
    image: `${import.meta.env.BASE_URL}papers/midl paper thumbnail 2.png`,
  },
  {
    title: 'LoRA-MME: Multi-Model Ensemble of LoRA-Tuned Encoders for Code Comment Classification',
    venue: 'NLBSE', location: 'Rio de Janeiro', year: '2026',
    authors: 'Md Akib Haider, Ahsan Bulbul*, Nafis Fuad Shahid*, Aimaan Ahmed, Mohammad Ishrak Abedin',
    abstract: 'Ensemble approach combining four code-specialized transformers (UniXcoder, CodeBERT, GraphCodeBERT, CodeBERTa) with parameter-efficient LoRA tuning. Got the highest F1 score among the selected teams.',
    tags: ['Code Intelligence', 'NLP'],
    pdf: `${import.meta.env.BASE_URL}papers/LoRA_MME__Multi_Model_Ensemble_of_LoRA_Tuned_Encoders_for_Code_Comment_Classification.pdf`,
    github: 'https://github.com/akibhaider/LoRA-MME-Code-Comment-Classification',
    image: `${import.meta.env.BASE_URL}papers/nlbse paper thuimbnail.png`,
  },
  {
    title: 'The Stealth of Free Rider Attacks: Assessing the Indistinguishability of Evasive Client Updates in Federated Learning',
    venue: 'CCCN', location: 'Jeju Island', year: '2026',
    authors: 'Nafis Fuad Shahid et al.',
    abstract: 'Showed that free riders in federated learning can stay undetected while maintaining model accuracy within 1% of honest training. The running average strategy exploits weaknesses in standard FedAvg aggregation.',
    tags: ['Federated Learning', 'Security'],
    pdf: null, github: null,
    image: `${import.meta.env.BASE_URL}papers/cccn paper thumbnail.png`,
  },
];

// ─── Sub-component with flip card ────────────────
function PaperCard({
  paper, index, observeRef,
}: {
  paper: (typeof papers)[0];
  index: number;
  observeRef: (el: HTMLElement | null) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const setRef = (el: HTMLDivElement | null) => {
    (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    observeRef(el);
  };

  // Front: Image, title, venue
  const front = (
    <div className="flex flex-col h-full min-h-[360px]">
      <div className="relative -m-6 mb-4 overflow-hidden" style={{ height: '220px' }}>
        <img
          src={paper.image}
          alt={paper.title}
          className="w-full h-full"
          style={{
            objectFit: 'contain',
            objectPosition: 'center',
            backgroundColor: 'var(--bg-tertiary)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)',
          }}
        />
        <div className="absolute bottom-4 left-6 right-6">
          <span
            className="badge text-xs mb-2 inline-block"
            style={{
              background: 'rgba(255,255,255,0.95)',
              color: '#2a2622',
              padding: '4px 12px',
            }}
          >
            {paper.venue} {paper.year}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3
            className="text-lg font-medium leading-snug mb-3"
            style={{ letterSpacing: '-0.01em', color: 'var(--text-primary)' }}
          >
            {paper.title}
          </h3>

          <div className="flex flex-wrap gap-2">
            {paper.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1"
                style={{
                  color: 'var(--accent-primary)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '12px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs mt-4" style={{ color: 'var(--accent-primary)' }}>
          <span>Click to read abstract</span>
          <span style={{ fontSize: '14px' }}>→</span>
        </div>
      </div>
    </div>
  );

  // Back: Abstract, authors, links
  const back = (
    <div className="flex flex-col justify-between h-full min-h-[360px]">
      <div>
        <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
          {paper.authors}
        </p>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          {paper.abstract}
        </p>
      </div>

      <div className="flex items-center justify-between">
        {(paper.pdf || paper.github) && (
          <div className="flex items-center gap-4">
            {paper.pdf && (
              <a
                href={paper.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press link-underline text-sm"
                style={{
                  color: 'var(--accent-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                Paper
              </a>
            )}
            {paper.github && (
              <a
                href={paper.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press link-underline text-sm"
                style={{
                  color: 'var(--accent-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                Code
              </a>
            )}
          </div>
        )}

        <div className="text-xs" style={{ color: 'var(--accent-primary)' }}>
          Click to flip back
        </div>
      </div>
    </div>
  );

  return (
    <div ref={setRef} className={`reveal reveal-delay-${index + 1}`}>
      <FlipCard front={front} back={back} className="card-glow" />
    </div>
  );
}

// ─── Main component ──────────────────────────────────────
export default function Research() {
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
    <section id="research" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div
          ref={(el) => { itemRefs.current[0] = el; }}
          className="reveal mb-8"
        >
          <h2
            className="text-4xl md:text-5xl font-light tracking-tight mb-4"
            style={{ letterSpacing: '-0.02em', color: 'var(--text-primary)' }}
          >
            Research
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Working on privacy-preserving machine learning and AI for healthcare.
            Interested in federated learning, medical imaging, and making ML systems more robust and trustworthy.
          </p>
        </div>

        <div className="space-y-8">
          {papers.map((paper, i) => (
            <PaperCard
              key={paper.title}
              paper={paper}
              index={i}
              observeRef={(el) => { itemRefs.current[i + 1] = el; }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}