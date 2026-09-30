---
status: review
title: "Firestore performance: measure the slow path before adding a cache"
excerpt: "Separate cold and warm loads, inspect query scope, and define cache freshness before claiming an app performance improvement."
date: "2026-03-01"
updated: "2026-10-01"
reviewed: true
tags: ["Firebase", "Mobile", "Performance"]
readTime: "4 min read"
---

A faster response is useful only if it returns the right data. When a mobile app loads slowly, adding a cache can hide the symptom while introducing stale data or inconsistent behavior across servers.

This article replaces an earlier version whose headline and cold-load timing were not comparable. The earlier numerical claims have been removed because the public article did not supply reproducible measurement evidence. The approach below is a diagnostic guide, rather than a new benchmark or a claim about a client's results.

## Define the measurement first

Specify the flow: launching the app, opening a list, or refreshing an existing screen. Record where timing starts and stops. Server response time and a screen becoming usable are different measurements.

Separate cold and warm conditions. Include device, network, dataset size, authentication state and cache state in the test notes. Compare the same workload before and after the change, and examine the slower requests as well as the typical request.

## Check how much work the query asks for

Fetch the data needed for the current screen. An unbounded list can make a small dataset appear fast during development and become expensive later. Use a defined page size and a pagination method that fits the query.

Review the query against the current index requirements and inspect any missing-index errors. See [Firestore query guidance](https://firebase.google.com/docs/firestore/query-data/queries) and [query cursors](https://firebase.google.com/docs/firestore/query-data/query-cursors).

Avoid turning every small UI event into a fresh read of the same large collection. Decide when a subscription, a targeted refresh or a one-time fetch fits the actual experience.

## Treat caching as a product decision

Define how stale the data may be. A discovery list and a payment status do not have the same freshness requirements. Decide what invalidates the cache and how that decision works across multiple server instances.

A process-local cache is not shared by every instance. It may disappear on restart, and two instances can return different versions. Those properties need to be acceptable for the particular flow before a local cache is used.

Check Firestore's [offline persistence documentation](https://firebase.google.com/docs/firestore/manage-data/enable-offline) for the behavior of the actual client platform in use. Do not assume a server cache and a mobile SDK's local persistence solve the same problem.

## Report an improvement honestly

Record the baseline, change, workload, cold/warm behavior and read counts under matching conditions. Explain what did not improve and what tradeoff was accepted. Keep the evidence with the project notes before turning a result into a public case-study claim.

For a business owner, the useful question is whether a customer can complete the flow reliably and whether the operating cost stays understandable. A single fast request is not enough to answer it.

[Discuss an existing product](https://www.buildzn.com/#contact) if you need help defining the slow flow and scoping an improvement.
