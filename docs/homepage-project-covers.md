# Homepage project cover illustrations

The four WebP files in `public/project-covers/` are generated editorial cover illustrations approved for the homepage. They illustrate the tasks; they are not actual interface captures or client results. `HomeProjectCard` labels that distinction visibly and in image alt text.

- Inquiry assistant: fictional lead DEMO-001 and a reply waiting for human review.
- Support assistant: the fictional KB-01 delivery policy, its supported answer, source citation and uncertainty handoff.
- Document processing: the sample text-invoice input and checked fields for DEMO-1042 (240 + 24 = 264 USD), with review before CSV/JSON export. The paper composition is a material metaphor for text parsing, not a claim of OCR or a paid invoice.
- NexusOS agent operations: public-source review of a log-ingestion guard. The illustration explicitly states that external agent actions are not stopped. It does not represent a connected production dashboard or verified security results.

The covers share a dark-green/cream palette and natural lighting, while their subjects distinguish the four projects. They are 1536px-wide WebP assets, lazy-loaded through responsive Next.js Image rendering. The homepage crop uses a 35% vertical focal point; mobile keeps a 220px image area. Total source WebP size is 694,352 bytes.

Actual captures in `public/demos/`, the evidence metadata in `content/business/projects.json`, the detail-page evidence and the `/work` index remain unchanged. Keep those real screenshots separate from cover illustrations.
