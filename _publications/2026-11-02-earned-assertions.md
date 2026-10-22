---
title: "Self-Corroborating Personalization: Preventing an Assistant's Suggestions from Becoming Evidence About the User"
collection: publications
category: working_papers
permalink: /publication/2026-earned-assertions
status: "Work in Progress"
excerpt: 'LLM assistants with memory can store a user''s passing agreement with their own suggestion as a preference, then count later reactions to it as independent evidence. This work introduces <i>interaction independence</i> to distinguish genuinely user-originated evidence from self-corroborating loops.'
date: 2026-11-02
---

**Work in progress.** Targeting [IUI 2027](https://iui.acm.org/).

When an LLM assistant with persistent memory suggests a preference and the user says "yeah, nice," the system may store that as a user preference. Later, when the assistant personalizes based on the stored belief, the user's agreement is recorded as additional evidence. But the assistant caused both observations: the first was a reaction to a suggestion, the second a reaction to the assistant restating its own stored belief. Three dependent observations do not equal three independent confirmations.

Existing provenance-tracking approaches (e.g., typed memory lineage) check **source independence**: did two records come from different upstream sources? This work checks a different property, **interaction independence**: did the user produce this evidence independently of the assistant's own prior personalization? When the assistant's stored belief caused it to restate the belief, and the user's reaction is then treated as new evidence, the system has manufactured its own corroboration.

The proposed system, **Earned Assertions**, tags every stored preference with a dependency root tracing it back to the original AI intervention. Evidence that descends from the same root is grouped into one evidence family and counted once, not separately. A four-level evidence taxonomy (inference, assistant-seeded uptake, discriminative choice, explicit statement) determines what the assistant is allowed to assert. A deterministic controller checks each response's assertion level against the available evidence and downgrades unsupported claims before they reach the user.

A controlled benchmark (EchoPref, 150-300 multi-session traces) tests whether dependency-aware assertion control prevents belief escalation while preserving genuine personalization.
