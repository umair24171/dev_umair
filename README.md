# BuildZn

Next.js website for Umair Bilal's independent product-development practice.

## Local development

Use Node 22 or later. Run `npm ci`, then `npm run dev` and open http://localhost:3000.

Before pushing: `npm run lint`, `npm run check`, `npm test`, `npm run build`. The production build fetches Google Fonts and needs network access. Preview with `npm run start`.

## Site content

Shared links, project scope, service descriptions and process: `lib/site.ts`. Home, About, service routes and project routes use this content. Real product assets are in `public/`; public store screenshots retain their provenance in the project records. Do not add outcome or ownership claims without evidence.

Contact uses the existing Formspree form. No keys are required in browser code. Verify a controlled real submission reaches the inbox before claiming delivery. Error handling keeps the entered details and offers email as an alternative. The optional budget field is for qualification, not a quote.

Google Analytics loads only after opt-in. Anonymous custom events contain action/location categories, never the inquiry text or contact details. Footer/privacy preferences allow withdrawal. Configure campaign parameters for LinkedIn and compare qualified leads in your own lead records.

## Articles

Published content is in `content/posts`. `status: draft` and `status: review` are excluded from pages, APIs and sitemap. Redirected duplicates remain recoverable but are excluded from discovery. Markdown raw HTML is escaped and links are limited to safe protocols. Unreviewed legacy articles carry an archive notice. Follow `content/EDITORIAL.md` before publishing.

The manual GitHub workflow prepares an unpublished draft artifact. There is no scheduled autopublishing, automatic cross-posting or external notification. Moving reviewed content to the published folder is a deliberate repository change.

## Deployment

The configured GitHub repository uses Vercel. Push the validated main branch to trigger its connected deployment, then verify the deployed commit and public routes. Do not place credentials in URLs, content, analytics or source files.
