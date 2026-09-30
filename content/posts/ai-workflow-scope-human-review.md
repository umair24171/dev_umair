---
title: "Before adding an AI agent, decide what it can change"
excerpt: "A draft reply and an issued refund have different consequences. Scope tool permissions, approval points and evaluation before automating a workflow."
date: "2026-10-01"
reviewed: true
intentKey: "workflow-human-approval"
keywords: ["human approval automation workflow", "AI agent permissions"]
status: published
tags: ["AI", "SaaS", "Product", "AI Agents"]
---

An agent that drafts a customer reply and an agent that issues a refund may use similar models. The product decisions around them are very different.

Before choosing the model, decide what the workflow can read, recommend and change. That boundary determines much of the implementation, review process and failure handling.

## Separate recommendation from action

Consider an illustrative support workflow. A system reads a ticket, retrieves relevant product documentation and prepares a response. An operator reviews the draft before it is sent.

That scope is different from automatically sending the reply, changing an account, or issuing a refund. Adding those actions changes the consequences of an error. It should be a deliberate scope change, with permissions and approval rules attached.

## Define permissions around the actual task

Write down the minimum data and tools the task needs. For each tool, specify whether it is read-only, prepares a proposed change, or executes a change.

A useful scope record includes:

- The task and the person responsible for it.
- The data the workflow may access.
- The actions it may perform without review.
- The actions that require approval.
- The behavior when a source is missing or contradictory.
- The way duplicate requests and retries are handled.

A tool existing in the system is not a reason to expose it to every agent.

## Evaluate failures before expanding the workflow

Use representative examples of the real task. Include ambiguous requests, missing information, conflicting sources and duplicate inputs—not only examples that make the demo look good.

For the support example, evaluation should examine whether the response is grounded in the right documentation, whether the system asks for clarification when necessary, and whether an operator can understand the basis of the draft. If actions are enabled, evaluation also needs to check that the system stays inside its authorization boundary.

Keep model versions, prompts, test examples and results together. A change to any of them can change behavior. Do not publish a reliability percentage without an actual workload, measurement method and record of failures.

## Count the work around the model

Operating cost can include retrieval, tool calls, retries, hosting, review time and monitoring. A cheap model call does not establish that the entire workflow is economical.

Decide what a useful improvement means: less repetitive work, faster handling, better retrieval, or a simpler handoff. Compare the workflow against that goal under matching conditions.

## Start with a bounded useful task

A draft-and-review workflow can provide value while leaving consequential decisions with a person. Expand autonomy only when the evidence and operating process support it.

BuildZn scopes [AI workflows and integrations](/services/ai-agents) around the task, evaluation and review requirements. [Share the workflow you want to improve](/contact), including the tools involved and the actions that must remain under human control.
