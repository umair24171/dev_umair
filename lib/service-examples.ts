// Illustrative acceptance scenarios, not client results or delivery commitments.
export const serviceExamples: Record<string, { title: string; input: string; work: string; output: string; checks: string[]; exclusion: string; note: string; href: string; anchor: string }> = {
  'workflow-automation': {
    title: 'From a sample inquiry to a review queue',
    input: 'A fictional inquiry contains an email address, a workflow brief and a request ID. One intake source and one destination are in scope.',
    work: 'Validate required fields, normalize the record, check the request ID for a previous delivery and route the request to its agreed owner. Prepare a reply draft for review.',
    output: 'One traceable inquiry record, its review status and any missing information. The operator can see failures and recover without creating a second record.',
    checks: ['Replay the same request ID: exactly one record remains.', 'Omit the brief: show a validation error rather than silently dropping the request.', 'Simulate a destination outage: retain a recoverable failure and test a safe retry.'],
    exclusion: 'This example excludes automatic replies, historical data migration and additional intake systems. The demonstration uses sample data; a production connection needs separate access and acceptance testing.',
    note: 'Before expanding volume, estimate usage, retries and review time.', href: '/blog/automation-operating-costs', anchor: 'Build an automation operating-cost estimate',
  },
  'ai-agents': {
    title: 'A source-grounded support draft',
    input: 'A fictional support question and an approved policy collection. The operator defines which documents the assistant may read.',
    work: 'Retrieve permitted passages, prepare an answer with supporting sources and place it in a review queue. Missing or conflicting evidence triggers a handoff instead of a guessed answer.',
    output: 'An editable draft, source references and a visible review decision. Sending or changing an account remains a separately authorized action.',
    checks: ['Ask a question answered by the policy: the draft cites the relevant passage.', 'Ask for an unsupported exception: the assistant requests human review.', 'Include an instruction inside a retrieved document: it must not grant new permissions.', 'Change an approved draft: require review of the revised version.'],
    exclusion: 'No guaranteed accuracy, unrestricted browsing or autonomous account changes. Evaluate representative and adversarial samples before agreeing to production permissions.',
    note: 'A useful boundary names both permitted preparation and actions that require approval.', href: '/blog/ai-workflow-scope-human-review', anchor: 'Define human review points in an AI workflow',
  },
  'api-integrations': {
    title: 'A repeatable form-to-CRM connection',
    input: 'A fictional form event with an event ID, contact fields and timestamp; one CRM destination with scoped test credentials.',
    work: 'Agree which system owns each field, validate the event and map it to a destination record. Record delivery outcomes and handle provider rate limits according to the provider contract.',
    output: 'A mapped sample record and a trace from source event to destination outcome. A response acknowledgement and completed synchronization are recorded separately.',
    checks: ['Deliver an event twice: no duplicate destination record is created.', 'Send an invalid field: reject it visibly without overwriting good data.', 'Simulate a rate limit and expired credentials: distinguish retryable failures from access failures.', 'Send an older conflicting update: apply the agreed source-of-truth rule.'],
    exclusion: 'Bulk migration, bidirectional conflict resolution and extra providers are separate scope. Provider plans, quotas and API permissions must be checked before implementation.',
    note: 'For webhook intake, first isolate whether the request reached the intended trigger.', href: '/blog/n8n-webhook-not-working', anchor: 'Diagnose webhook URL, method and registration issues',
  },
  'automation-repair': {
    title: 'Investigate a webhook that stopped triggering',
    input: 'A redacted delivery log, workflow export, last successful run and one reproducible sample request in a disposable environment.',
    work: 'Compare the exact URL, method and workflow state. Separate a missing trigger from a later execution failure, then change the smallest verified cause and record the before-and-after observations.',
    output: 'A diagnosis tied to evidence, an agreed targeted repair and a runbook describing recovery and remaining limitations.',
    checks: ['Replay the controlled sample: the intended workflow receives it.', 'Send an incomplete input: the operator sees the rejection.', 'Repeat a delivery: inspect duplicate handling before allowing real writes.', 'Re-run the prior successful case: the repair must not break it.'],
    exclusion: 'Investigation may reveal an unavailable vendor API, missing source or a larger rebuild. Those are findings to scope, not a promise that every failure can be repaired.',
    note: 'Capture the symptom before changing downstream nodes.', href: '/blog/n8n-webhook-not-working', anchor: 'Follow the webhook diagnostic checklist',
  },
};
