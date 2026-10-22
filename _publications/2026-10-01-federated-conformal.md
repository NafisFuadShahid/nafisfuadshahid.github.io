---
title: "When Average Calibration Fails: Site-Conditional Federated Conformal Risk Control"
collection: publications
category: conferences
permalink: /publication/2026-federated-conformal
status: "Accepted for Oral Presentation at"
image: '/images/paper_decaf.png'
excerpt: '<b>Accepted for oral presentation; sole author.</b> Pooled federated conformal calibration protects the average hospital but violates its coverage guarantee at 40% of individual institutions, with the worst site missing the target by 7.8 points. Risk-curve shrinkage adds one interpolation parameter to restore site-level reliability, sharing only per-site scalars.'
date: 2026-10-01
venue: '<a href="https://workshop-decaf.github.io/decaf-2026/">DeCaF Workshop</a> @ MICCAI 2026, Strasbourg'
paperurl: 'https://arxiv.org/abs/2606.20115'
citation: 'Nafis Fuad Shahid. (2026). &quot;When Average Calibration Fails: Site-Conditional Federated Conformal Risk Control.&quot; <i>DeCaF Workshop @ MICCAI 2026</i>. arXiv:2606.20115.'
---

**Accepted for oral presentation at the [DeCaF Workshop](https://workshop-decaf.github.io/decaf-2026/), MICCAI 2026. Sole author.**

<figure style="margin:1.5em 0;">
  <img src="/images/paper_decaf.png" alt="Risk-curve shrinkage: each site's empirical risk curve is interpolated toward a pooled reference to restore per-site coverage" style="width:100%;border-radius:6px;" />
  <figcaption style="font-size:0.85em;color:#777;margin-top:0.4em;">Each site transmits its empirical risk curve; a single parameter interpolates between local and pooled calibration to give site-specific thresholds.</figcaption>
</figure>

Conformal risk control (CRC) gives a model a distribution-free guarantee: for a task like tumor segmentation, its prediction sets meet a target error rate on held-out data. In a federated deployment the standard shortcut is to pool everyone's calibration scores into a single threshold. This work shows that shortcut quietly fails the sites least able to absorb it.

On FeTS-2022 (1,251 subjects across 20 institutions), naive pooled CRC protects the *average* hospital but **violates coverage at 40% of individual institutions**, with the worst site exceeding its target false-negative rate by **7.8 percentage points**. The cause is a hidden design choice: the aggregation weights silently decide whose coverage is protected. Sample-size weighting optimizes patient-level validity but sacrifices institution-level reliability; equal-site weighting improves per-institution reliability at comparable efficiency, using only a single scalar per site.

The proposed method, **risk-curve shrinkage**, makes this trade-off explicit and tunable. Each site transmits only its empirical risk curve, and a single hyperparameter smoothly interpolates between site-specific local calibration and sample-size-weighted pooled calibration. A leave-one-site-out sensitivity analysis selects that parameter, cutting violations to 2.7 of 20 sites at a modest efficiency cost. A finite-sample correction term proves essential: removing it triples the violations, and a direct budget-optimization alternative fails by concentrating risk on the most vulnerable hospitals. Throughout, no patient-level images, masks, or per-volume scores ever leave a site.

[arXiv:2606.20115](https://arxiv.org/abs/2606.20115)
