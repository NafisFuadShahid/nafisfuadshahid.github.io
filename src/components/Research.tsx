import { useEffect, useRef } from 'react';
import { FileText, ExternalLink } from 'lucide-react';

const papers = [
  {
    title: 'Probabilistic Feature Imputation and Uncertainty-Aware Multimodal Federated Aggregation',
    venue: 'MIDL 2026',
    venueLabel: 'Medical Imaging with Deep Learning',
    location: 'Full Paper',
    year: '2026',
    authors: 'Nafis Fuad Shahid, Maroof Ahmed*, Md Akib Haider*, Saidur Rahman Sagor, Aashnan Rahman, Md Azam Hossain',
    abstract: 'PFIN handles missing modalities in federated medical imaging by using probabilistic distributions instead of point estimates. Our uncertainty-aware aggregation method improved AUC by 5.36% on chest X-ray classification when modalities are missing.',
    tags: ['Federated Learning', 'Medical Imaging'],
    highlight: 'MIDL 2026',
    highlightColor: '#60a5fa',
    pdf: '/papers/midl26_335.pdf',
    github: 'https://github.com/NafisFuadShahid/PFIN-UQAVG',
    accentColor: '#60a5fa',
    borderColor: 'rgba(96,165,250,0.1)',
    bgColor: 'rgba(96,165,250,0.04)',
  },
  {
    title: 'LoRA-MME: Multi-Model Ensemble of LoRA-Tuned Encoders for Code Comment Classification',
    venue: 'NLBSE 2026',
    venueLabel: 'Workshop @ ICSE',
    location: 'Rio de Janeiro',
    year: '2026',
    authors: 'Md Akib Haider, Ahsan Bulbul*, Nafis Fuad Shahid*, Aimaan Ahmed, Mohammad Ishrak Abedin',
    abstract: 'Ensemble approach combining four code-specialized transformers (UniXcoder, CodeBERT, GraphCodeBERT, CodeBERTa) with parameter-efficient LoRA tuning. Got the highest F1 score in the shared task.',
    tags: ['Code Intelligence', 'NLP'],
    highlight: 'NLBSE @ ICSE 2026',
    highlightColor: '#34d399',
    pdf: '/papers/LoRA_MME__Multi_Model_Ensemble_of_LoRA_Tuned_Encoders_for_Code_Comment_Classification.pdf',
    github: null,
    accentColor: '#34d399',
    borderColor: 'rgba(52,211,153,0.1)',
    bgColor: 'rgba(52,211,153,0.04)',
  },
  {
    title: 'The Stealth of Free Rider Attacks: Assessing the Indistinguishability of Evasive Client Updates in Federated Learning',
    venue: 'CCCN 2025',
    venueLabel: 'Conference',
    location: 'Jeju Island',
    year: '2025',
    authors: 'Nafis Fuad Shahid et al.',
    abstract: 'Showed that free riders in federated learning can stay undetected while maintaining model accuracy within 1% of honest training. The running average strategy exploits weaknesses in standard FedAvg aggregation.',
    tags: ['Federated Learning', 'Security'],
    highlight: 'CCCN 2025',
    highlightColor: '#f59e0b',
    pdf: null,
    github: null,
    accentColor: '#f59e0b',
    borderColor: 'rgba(245,158,11,0.1)',
    bgColor: 'rgba(245,158,11,0.04)',
  },
];

export default function Research() {
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
    <section id="research" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div
          ref={(el) => { itemRefs.current[0] = el; }}
          className="reveal mb-12"
        >
          <h2
            className="text-4xl md:text-5xl font-light tracking-tight mb-4"
            style={{
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            Research
          </h2>
        </div>

        <div className="space-y-8">
          {papers.map((paper, i) => (
            <article
              key={paper.title}
              ref={(el) => { itemRefs.current[i + 1] = el; }}
              className={`reveal reveal-delay-${i + 1} card-hover p-6 border-l-2`}
              style={{
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3
                  className="text-lg font-medium leading-snug"
                  style={{
                    letterSpacing: '-0.01em',
                    color: 'var(--text-primary)',
                  }}
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

              <div className="flex flex-wrap gap-3">
                {paper.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs"
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {(paper.pdf || paper.github) && (
                <div className="flex items-center gap-4 mt-4">
                  {paper.pdf && (
                    <a
                      href={paper.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-sm transition-colors duration-300"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Paper
                    </a>
                  )}
                  {paper.github && (
                    <a
                      href={paper.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-sm transition-colors duration-300"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Code
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
