import projectRecords from '../content/business/projects.json';
export const site = {
  url: 'https://www.buildzn.com', email: 'buildznofficial@gmail.com',
  linkedin: 'https://www.linkedin.com/in/umair-bilal-/', github: 'https://github.com/umair24171',
  contact: '/contact', whatsapp: 'https://wa.me/923067128817?text=Hi%20Umair%2C%20I%20would%20like%20to%20discuss%20a%20business%20automation%20workflow.', formId: 'xykywokz',
};
export const processSteps = [
  { title: 'Map the work', text: 'Walk through one repetitive task, the tools involved and what happens when something goes wrong.' },
  { title: 'Define the boundaries', text: 'Agree on inputs, deliverables, approval points, acceptance tests, dependencies and price.' },
  { title: 'Build & evaluate', text: 'Review working milestones. Test normal cases, missing data, duplicates and failures against agreed examples.' },
  { title: 'Hand over & operate', text: 'Receive source, workflow documentation and account ownership guidance. Agree on monitoring and support separately.' },
];
export const services = [
  { slug: 'workflow-automation', number: '01', name: 'Workflow automation', short: 'Move the work forward, without the copy and paste.',
    description: 'Connect intake, routing, updates and reminders across the tools your team already uses.', audience: 'Operations teams moving the same information between forms, spreadsheets and business systems.',
    problem: 'A new request arrives, someone copies it into a tracker, assigns an owner and chases the next step. Manual handoffs make it easy to lose context.',
    deliverables: ['Workflow map with triggers, owners and review points', 'Configured workflow and agreed system connections', 'Duplicate protection, retries and visible failure handling', 'Acceptance examples, runbook and handover'],
    boundaries: 'Access to your systems and representative sample data is required. Subscription fees, usage limits and ongoing operations are scoped separately. We agree which actions can run automatically.',
    questions: ['What starts the workflow?', 'Where does the information go next?', 'Who owns exceptions?', 'Which actions need approval?'] },
  { slug: 'ai-agents', number: '02', name: 'AI agents', short: 'Prepare the next step. Keep people in control.',
    description: 'Assistants that structure inquiries, retrieve approved knowledge and prepare work for human review.', audience: 'Service businesses and support teams handling repetitive questions, requests and documents.',
    problem: 'Information arrives as free text. Your team has to interpret it, find the right source and decide what to do. An assistant needs a bounded task and an honest fallback.',
    deliverables: ['Task scope, permitted data and tool permissions', 'Structured outputs or source-grounded drafts', 'Approval queue and handoff behavior', 'Representative evaluation set and operating-cost review'],
    boundaries: 'AI can make mistakes. Model usage and third-party accounts are separate costs. Accuracy is evaluated on agreed examples; sensitive actions remain behind agreed approval rules.',
    questions: ['What should the assistant read and prepare?', 'Which sources are authoritative?', 'What should it do when uncertain?', 'What mistakes are unacceptable?'] },
  { slug: 'api-integrations', number: '03', name: 'API integrations', short: 'Get your systems talking to each other.',
    description: 'Reliable data exchange between your CRM, help desk, forms, databases and internal tools.', audience: 'Teams whose business systems contain useful information but do not share it reliably.',
    problem: 'Records drift between tools, and a failed connection goes unnoticed. Field mapping, access controls and repeatable failure recovery matter as much as the happy path.',
    deliverables: ['Field mapping and source-of-truth decisions', 'API or webhook connections with scoped authentication', 'Validation, duplicate handling and rate-limit recovery', 'Integration tests, logging guidance and documentation'],
    boundaries: 'Provider API availability, permissions and quotas determine feasibility. Account access, migration, historical sync and ongoing hosting are identified before implementation.',
    questions: ['Which tools need to connect?', 'Which system owns each field?', 'Is API access available on your plan?', 'What should happen to conflicting records?'] },
  { slug: 'automation-repair', number: '04', name: 'Automation repair', short: 'Find the broken step. Make failures visible.',
    description: 'Diagnose failed workflows, unreliable agents, duplicate records and integrations that silently stop.', audience: 'Teams with an existing automation that needs investigation and a maintainable fix.',
    problem: 'A workflow worked once, then an API changed or an unexpected input broke it. Reproduce the failure before deciding whether to repair or replace it.',
    deliverables: ['Review of workflow, logs and reproducible failures', 'Prioritized diagnosis and agreed repair scope', 'Targeted fixes with regression examples', 'Recovery instructions and monitoring recommendations'],
    boundaries: 'Source or workflow access and failure examples are needed. Discovery may reveal vendor limits or a larger rebuild; further work is quoted explicitly rather than assumed.',
    questions: ['What stopped working?', 'When did it last succeed?', 'Are logs and workflow access available?', 'What is the consequence of a missed or duplicate run?'] },
];
export const projects = projectRecords;
export const faqs = [
  { question: 'Where should we start?', answer: 'Pick one repetitive task with a clear owner and outcome. Share a sample input, the tools involved and what a correct result looks like. Discovery checks feasibility before a wider build.' },
  { question: 'Will an agent act without approval?', answer: 'Only within explicitly agreed boundaries. Sending replies, changing records and financial actions need permissions and review rules. The demonstrations do not execute external actions.' },
  { question: 'How do pricing and ongoing costs work?', answer: 'A proposal attaches a price to deliverables, dependencies and acceptance tests. Model usage, tool subscriptions, hosting and maintenance are identified separately. There are no guaranteed income or savings claims.' },
  { question: 'Can you repair our existing automation?', answer: 'Yes. Start with workflow access, logs and a reproducible failure. The review determines whether a focused repair or a larger change is appropriate.' },
  { question: 'What does the portfolio prove?', answer: 'It includes working sample-data demonstrations, BuildZn’s own web and editorial systems, and technical case studies linked to public source. Each page identifies its evidence and limits. Public builds are not presented as client results, security certifications or proof of business outcomes.' },
];
