import { useEffect, useRef } from 'react';

const papers = [
  {
    title: 'Probabilistic Feature Imputation and Uncertainty-Aware Multimodal Federated Aggregation',
    venue: 'MIDL', location: 'Taiwan', year: '2026',
    authors: 'Nafis Fuad Shahid, Maroof Ahmed*, Md Akib Haider*, Saidur Rahman Sagor, Aashnan Rahman, Md Azam Hossain',
    abstract: 'PFIN handles missing modalities in federated medical imaging by using probabilistic distributions instead of point estimates. Our uncertainty-aware aggregation method improved AUC by 5.36% on chest X-ray classification when modalities are missing.',
    tags: ['Federated Learning', 'Medical Imaging'],
    pdf: `${import.meta.env.BASE_URL}papers/midl26_335.pdf`,
    github: 'https://github.com/NafisFuadShahid/PFIN-UQAVG',
  },
  {
    title: 'LoRA-MME: Multi-Model Ensemble of LoRA-Tuned Encoders for Code Comment Classification',
    venue: 'NLBSE', location: 'Rio de Janeiro', year: '2026',
    authors: 'Md Akib Haider, Ahsan Bulbul*, Nafis Fuad Shahid*, Aimaan Ahmed, Mohammad Ishrak Abedin',
    abstract: 'Ensemble approach combining four code-specialized transformers (UniXcoder, CodeBERT, GraphCodeBERT, CodeBERTa) with parameter-efficient LoRA tuning. Got the highest F1 score among the selected teams.',
    tags: ['Code Intelligence', 'NLP'],
    pdf: `${import.meta.env.BASE_URL}papers/LoRA_MME__Multi_Model_Ensemble_of_LoRA_Tuned_Encoders_for_Code_Comment_Classification.pdf`,
    github: 'https://github.com/akibhaider/LoRA-MME-Code-Comment-Classification',
  },
  {
    title: 'The Stealth of Free Rider Attacks: Assessing the Indistinguishability of Evasive Client Updates in Federated Learning',
    venue: 'CCCN', location: 'Jeju Island', year: '2026',
    authors: 'Nafis Fuad Shahid et al.',
    abstract: 'Showed that free riders in federated learning can stay undetected while maintaining model accuracy within 1% of honest training. The running average strategy exploits weaknesses in standard FedAvg aggregation.',
    tags: ['Federated Learning', 'Security'],
    pdf: null, github: null,
  },
];

// ─── Sub-component with tilt + flashlight ────────────────
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

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2);
    const ny = (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2);
    el.style.transition = 'transform 0.07s ease-out, box-shadow 0.35s ease, border-color 0.35s ease';
    el.style.transform  = `perspective(1100px) rotateX(${-ny * 4}deg) rotateY(${nx * 4}deg) scale(1.008)`;
    el.style.setProperty('--flash-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--flash-y', `${e.clientY - rect.top}px`);
  };

  const onMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transition = 'transform 0.65s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.35s ease, border-color 0.35s ease';
    el.style.transform  = 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <article
      ref={setRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`reveal reveal-delay-${index + 1} tilt-card flashlight-card card-glow p-6 border-l-2`}
      style={{ borderColor: 'var(--border-color)' }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3
          className="text-lg font-medium leading-snug"
          style={{ letterSpacing: '-0.01em', color: 'var(--text-primary)' }}
        >
          {paper.title}
        </h3>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {paper.venue} {paper.year}
        </span>
        <span style={{ color: 'var(--text-tertiary)' }}>·</span>
        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          {paper.location}
        </span>
      </div>

      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
        {paper.abstract}
      </p>

      <div className="flex flex-wrap gap-3 mb-4">
        {paper.tags.map((tag) => (
          <span key={tag} className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            {tag}
          </span>
        ))}
      </div>

      {(paper.pdf || paper.github) && (
        <div className="flex items-center gap-4">
          {paper.pdf && (
            <a
              href={paper.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press link-underline text-sm"
              style={{
                color: 'var(--text-secondary)',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}
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
                color: 'var(--text-secondary)',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}
            >
              Code
            </a>
          )}
        </div>
      )}
    </article>
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