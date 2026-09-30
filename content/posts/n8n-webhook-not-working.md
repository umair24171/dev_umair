---
title: "n8n webhook not working: check URL, method and workflow state"
excerpt: "Diagnose an n8n webhook that is not firing: check the test or production URL, HTTP method, workflow state and endpoint conflicts before changing code."
date: "2026-10-01"
status: published
reviewed: true
intentKey: "n8n-webhook-not-working"
keywords: ["n8n webhook not working", "n8n production webhook", "n8n webhook URL"]
tags: ["Automation", "Integration", "Repair", "n8n"]
---

Start by comparing the caller’s exact URL and HTTP method with the Webhook node, then check whether you are testing or calling a published workflow. Changing downstream nodes will not repair a request that never reaches the intended trigger.

This is a diagnostic guide based on n8n’s current documentation, reviewed October 1, 2026. It is not a claim that BuildZn reproduced every failure on your version or deployment. Use a disposable workflow and sample data while diagnosing; avoid sending a test request into a workflow that changes real business records.

## Capture one failing request

Write down the request time, destination, method, response status and a safe request identifier. Remove credentials and customer data before sharing logs. Keep a copy of the workflow version and the source system’s delivery record.

First decide which failure you are investigating: no execution, an execution that fails later, or an execution that finishes while the caller receives an error. Those observations lead to different repairs. A successful HTTP response alone does not establish that the downstream business action completed.

## Check the test and production URL

The node provides separate test and production endpoints. A test listener must be running; production registration follows workflow publication. Production inputs are inspected through execution records rather than expecting them to appear in the editor. See the [official Webhook node documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/).

Compare the destination stored in the sending system with the URL currently shown by the node. Look for an old host, a copied path or a test endpoint left in an integration’s settings. Record the mismatch before correcting it so you can explain why the change matters.

## Match the request method and endpoint owner

A browser address-bar visit is not a substitute for the request your integration sends. Confirm the method in the sender’s delivery log. Also investigate whether another published workflow owns the same path-and-method pair. These checks are described in n8n’s [webhook common issues](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/common-issues/).

Resolve an endpoint conflict by assigning a distinct endpoint or retiring the conflicting workflow deliberately. Before changing a path, identify every sender that uses it. Otherwise, a local repair can break a different integration.

## Separate request acceptance from completed work

When an execution exists, inspect where it stopped and how the webhook response is configured. A connection problem and a downstream validation failure should not share one vague “not working” diagnosis.

For a long-running task, document what the caller considers a successful acknowledgement and how it will obtain the final outcome. Avoid repeatedly sending a real transaction just because a response was delayed. Give each sample delivery an identifier and inspect what already happened before repeating it.

## Verify the repair

Use one controlled sample request. Confirm the expected workflow receives it, inspect its execution record and compare the resulting sample record with the input. Then check a rejected or incomplete input and confirm that the failure is visible to the responsible person.

Preserve the before-and-after observations in a short runbook. The useful result is a reproducible explanation of the failure and a check that will catch its return. BuildZn’s [agent operations walkthrough](/work/nexusos-agent-operations) shows a separate source-based example of activity records and operational boundaries; it is not an n8n deployment.

## Limitations and next steps

Reverse proxies, authentication, provider retries and version-specific bugs can require additional investigation. This guide does not verify those conditions in your account or guarantee a repair. Bring the workflow export, redacted delivery log and reproduction to an [automation repair review](/services/automation-repair). If the connection needs rebuilding, define the source of truth and acceptance examples before implementing the [API integration](/services/api-integrations).
