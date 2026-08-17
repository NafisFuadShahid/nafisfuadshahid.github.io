---
title: "The Stealth of Free Rider Attacks: Assessing the Indistinguishability of Evasive Client Updates in Federated Learning"
collection: publications
category: conferences
permalink: /publication/2026-free-rider-attacks
status: "Accepted at"
excerpt: 'A federated-learning client can train honestly at first to build credibility, then coast by submitting a running average of the global model. The updates stay statistically indistinguishable from honest ones under norm-based inspection, holding global accuracy within 1% of clean while saving roughly 70% of compute.'
date: 2026-02-01
venue: '<a href="https://www.cccn.net/">CCCN 2026</a>'
paperurl: 'https://nafisfuadshahid.github.io/files/cccn2026.pdf'
citation: 'Nafis Fuad Shahid, et al. (2026). &quot;The Stealth of Free Rider Attacks: Assessing the Indistinguishability of Evasive Client Updates in Federated Learning.&quot; <i>CCCN 2026</i>.'
---

**Accepted at [CCCN 2026](https://www.cccn.net/).**

Federated learning assumes that every client genuinely expends compute training on its local data. A free rider seeks the high-utility global model without incurring that cost. Earlier free-riding strategies (uploading noise or a copied model) tend to leave statistical signatures that a server can detect. This work studies a variant that does not.

The strategy, **Running Average with Honest Initialization**, proceeds in two phases. For the first several rounds the attacker trains honestly and stores those genuine updates in a small FIFO queue, establishing a credible history. Thereafter it ceases local training and submits the running average of the recent global models it has received. Because the network has largely converged by that point, this average falls within the natural round-to-round variance of honest updates, particularly in Non-IID settings where honest clients already diverge from one another.

Across MNIST and CIFAR-10, under both IID and Non-IID splits with 100 clients, the attack keeps global accuracy **within 1% of the clean baseline at 30% attacker prevalence** while saving approximately **70% of the attacker's compute**, and it remains undetectable under norm-based inspection. A theoretical indistinguishability argument supports these findings. The implication is that defenses relying on update magnitude or simple statistical profiling are insufficient against patient, time-delayed evasion.

[PDF](https://nafisfuadshahid.github.io/files/cccn2026.pdf)
