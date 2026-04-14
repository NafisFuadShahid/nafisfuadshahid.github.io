import { useEffect, useRef } from 'react';
import { FileText, ExternalLink, Award, TrendingUp } from 'lucide-react';

const papers = [
  {
    title: 'Probabilistic Feature Imputation and Uncertainty-Aware Multimodal Federated Aggregation',
    venue: 'MIDL 2026',
    venueLabel: 'Medical Imaging with Deep Learning',
    location: 'Full Paper',
    year: '2026',
    authors: 'Nafis Fuad Shahid, Maroof Ahmed*, Md Akib Haider*, Saidur Rahman Sagor, Aashnan Rahman, Md Azam Hossain',
    abstract: 'We propose PFIN (Probabilistic Feature Imputation Network), addressing missing modality challenges in federated medical imaging. By replacing deterministic point estimates with calibrated distributions, our Fed-UQ-Avg aggregation achieves +5.36% AUC gain in the most challenging configuration on chest X-ray classification.',
    tags: ['Federated Learning', 'Medical Imaging', 'Uncertainty Quantification', 'Multimodal'],
    highlight: '+5.36% AUC improvement',
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
    venueLabel: 'Natural Language-based Software Engineering Workshop @ ICSE',
    location: 'Rio de Janeiro, Brazil',
    year: '2026',
    authors: 'Md Akib Haider, Ahsan Bulbul*, Nafis Fuad Shahid*, Aimaan Ahmed, Mohammad Ishrak Abedin',
    abstract: 'LoRA-MME combines four code-specialized transformer encoders (UniXcoder, CodeBERT, GraphCodeBERT, CodeBERTa) via parameter-efficient LoRA fine-tuning and a learned weighted ensemble strategy. Achieved the highest F1 score (0.7906 Weighted F1) in the competition, ranking 2nd on the overall leaderboard among 4 accepted papers.',
    tags: ['NLP', 'Code Intelligence', 'LoRA', 'Ensemble Learning'],
    highlight: 'Highest F1 Score — NLBSE 2026',
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
    venueLabel: 'Cognitive Computing & Communications Network',
    location: 'Jeju Island, South Korea',
    year: '2025',
    authors: 'Nafis Fuad Shahid et al.',
    abstract: 'We investigate sophisticated free rider attacks in Federated Learning, demonstrating that a "Running Average with Honest Initialization" strategy maintains global model accuracy within 1% deviation while remaining statistically indistinguishable from honest clients, exposing a critical blind spot in the standard FedAvg aggregation algorithm.',
    tags: ['Federated Learning', 'Security', 'Adversarial ML'],
    highlight: '1% accuracy deviation — undetectable attack',
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
    <section id="research" className="py-32 px-6 pb-40">
      <div className="max-w-5xl mx-auto">
        <div
          ref={(el) => { itemRefs.current[0] = el; }}
          className="reveal mb-16"
        >
          <span className="section-label" style={{ color: '#34d399' }}>
            Research
          </span>
          <h2
            className="text-4xl md:text-5xl font-light mt-3 tracking-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            Published Papers
          </h2>
          <p className="text-sm text-white/40 mt-3 max-w-lg leading-relaxed">
            3 papers accepted at international venues in 2025–2026,
            spanning federated learning, medical AI, and software engineering.
          </p>
        </div>

        <div className="space-y-5">
          {papers.map((paper, i) => (
            <article
              key={paper.title}
              ref={(el) => { itemRefs.current[i + 1] = el; }}
              className={`reveal reveal-delay-${i + 1} card-hover rounded-2xl p-8 border`}
              style={{
                borderColor: paper.borderColor,
                background: paper.bgColor,
              }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="badge font-semibold"
                    style={{
                      background: `${paper.accentColor}15`,
                      border: `1px solid ${paper.accentColor}25`,
                      color: paper.accentColor,
                    }}
                  >
                    {paper.venue}
                  </span>
                  <span className="text-xs text-white/30">{paper.venueLabel}</span>
                  <span className="text-white/15">·</span>
                  <span className="text-xs text-white/30">{paper.location}</span>
                </div>
                <span className="text-xs text-white/30">{paper.year}</span>
              </div>

              <h3 className="text-lg font-medium text-white leading-snug mb-3" style={{ letterSpacing: '-0.01em' }}>
                {paper.title}
              </h3>

              <p className="text-xs text-white/35 mb-4 italic">
                {paper.authors}
              </p>

              <p className="text-sm text-white/50 leading-relaxed mb-5">
                {paper.abstract}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {paper.tags.map((tag) => (
                    <span
                      key={tag}
                      className="badge"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        color: 'rgba(255,255,255,0.4)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <TrendingUp size={11} style={{ color: paper.accentColor }} />
                  <span
                    className="text-xs font-medium"
                    style={{ color: paper.accentColor }}
                  >
                    {paper.highlight}
                  </span>
                </div>
              </div>

              {(paper.pdf || paper.github) && (
                <div
                  className="flex items-center gap-4 mt-5 pt-5"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {paper.pdf && (
                    <a
                      href={paper.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-xs font-medium transition-colors duration-200"
                      style={{ color: paper.accentColor }}
                    >
                      <FileText size={12} />
                      Read Paper
                    </a>
                  )}
                  {paper.github && (
                    <a
                      href={paper.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-xs font-medium text-white/40 hover:text-white/70 transition-colors duration-200"
                    >
                      <ExternalLink size={12} />
                      View Code
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>

        <div
          ref={(el) => { itemRefs.current[papers.length + 1] = el; }}
          className="reveal mt-8 grid grid-cols-3 gap-4"
        >
          {[
            { value: '3', label: 'Papers Accepted', color: '#60a5fa' },
            { value: '2026', label: 'Latest Publications', color: '#34d399' },
            { value: 'MIDL · NLBSE · CCCN', label: 'Venues', color: '#f59e0b' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-5 border text-center"
              style={{
                borderColor: 'rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <div className="text-xl font-semibold mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs text-white/35">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
