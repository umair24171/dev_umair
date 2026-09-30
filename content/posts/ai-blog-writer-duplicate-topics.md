---
title: "AI blog writer repeating topics? Compare search intent before drafting"
excerpt: "Keep an AI blog writer from creating competing articles for one search intent. Compare published pages and pending drafts before preparing new content."
date: "2026-10-01"
status: published
reviewed: true
intentKey: "seo-topic-cannibalization"
keywords: ["AI blog writer duplicate topics", "AI blog writer repeating topics", "content intent deduplication"]
tags: ["Automation", "AI", "Content", "Workflow"]
---

When a blog writer keeps producing the same article with a new title, compare the reader’s problem and intended answer before generating more text. A title history alone cannot decide whether an article should be new, an update or a draft waiting for review.

BuildZn’s [editorial agent](/work/seo-content-agent) now makes that decision before model generation. Its offline regression checks exercise the intent decision and pending-draft history. This explains the implemented workflow, not a claim about achieved rankings, traffic or leads.

## Identify what the history actually contains

An agent can read a remote topic registry that has stopped being updated. That makes a prompt such as “avoid recent topics” ineffective even when the model follows it. Inspect the registry’s source, update path and failure behavior before changing the writing prompt.

The BuildZn pipeline reads local reviewed public articles and accepted draft manifests. Quarantined legacy posts do not establish current expertise or public coverage. A corrupt draft manifest stops planning; the pipeline does not silently replace it with an empty history. These behaviors are visible in the [pipeline implementation](https://github.com/umair24171/dev_umair/blob/main/agent/lib/pipeline.js).

## Store an intent key alongside the title

The intent key names the decision or problem the article should resolve. It remains stable when the title changes. The record also carries the target keyword, current canonical route and publication state.

For example, deciding where to require human approval is a different task from diagnosing an invoice arithmetic failure, even though both involve automation review. They can share a cluster and link to each other. An article that merely restates the approval decision should improve the existing page.

BuildZn uses explicit intent keys, keyword normalization and title similarity as a warning mechanism. This is a bounded heuristic, not a universal semantic detector. A human still compares ambiguous topics before publication.

## Include pending drafts in the decision

A draft can be generated several times before any version reaches the public blog. Published-only history misses that duplication.

The plan marks an existing public intent as an update. An accepted unpublished draft is marked for review rather than generating another version automatically. Failed candidates remain available for diagnosis but do not claim the intent as completed work. The [regression tests](https://github.com/umair24171/dev_umair/blob/main/agent/tests/pipeline.test.js) cover that difference.

## Verify the behavior with a small history

Create a test history containing a published intent. Planning that intent should point to the existing route. A different intent in the same cluster should remain eligible. Next, create an accepted draft manifest for the first intent and check that planning requests review of that draft.

Also test damaged history. An error should be visible; it should not make the system behave as if no article exists. These are offline tests. They do not require a language model, search account or publication action.

## Limitations: duplication checks do not create authority

Distinct intent keys can still describe substantially overlapping answers. Review the brief’s answer promise and sources, not just its identifier. Conversely, two pages using the same technology can serve different readers and deserve separate treatment.

Topic selection also needs actual evidence of usefulness. An observed support issue is evidence that a problem was reported, while Search Console impressions measure queries for your site. Neither should be renamed market-wide keyword volume. The agent keeps those labels separate.

A repaired history is one part of a useful [business automation workflow](/services/workflow-automation). Source retrieval, truthful project evidence, technical verification and human editorial review still determine whether the article deserves to be published. For running-cost planning, separate those model and provider charges from the [implementation scope](/blog/automation-operating-costs).
