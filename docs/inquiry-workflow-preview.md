# Commercial enquiry workflow preview

This branch prepares the approved SparkleClean commercial enquiry demo without merging or deploying it. The same `index.html`, `app.js`, `styles.css`, `config.json` and assets are used by the local video kit and by the site under `public/demos/inquiry-workflow/`. `CommercialInquiryDemo.tsx` embeds this code in interactive mode on `/work/inquiry-assistant`.

The example is fictional: SparkleClean Ltd., a practice manager at Example Dental Practice in Manchester, weekly evening office cleaning across three floors, start date 02/11/2026. Company names are plain text.

## What works

- Required field checks, an allowlisted service and calendar-valid dd/mm/yyyy dates.
- Configured acknowledgement and reply templates. The selected service supplies a standard follow-up question. The question is always appended by the template, not inferred from the message. The reply is built from fields, using a configurable service reply name and an en-GB long date such as 2 November 2026; it does not echo the customer message.
- A lead tracker with a timestamp from the actual system clock, formatted using en-GB and Europe/London.
- An Owner review entry containing the enquiry and reply before approval.
- One-click approval changes the tracker status from Awaiting review to Approved and the reply chip to Approved, not sent. Editing a reply clears approval.

## Limits

Everything remains in browser memory and disappears on reload. There is no external CRM, email, WhatsApp, background worker, delivery integration, AI model, content-based missing-detail detection or persistent notification service in this preview. The recording operates real UI controls. Nothing is sent when approved.

## Configuration

Edit `public/demos/inquiry-workflow/config.json` for company name, subtitle, contact role, organisation, city, service names and standard questions, form heading, field labels, placeholders, buttons, sample enquiry, acknowledgement and reply templates, captions, end-card personal line, invitation and contact email. `endCard.fromLine` and `endCard.invitation` configure the two lines above the email. The email is read from `contactEmail`. Keep fictional data only. A property-viewing scenario needs configuration changes, not a second implementation.

The local preview kit adds `render.cjs` and `finish.py`. One command renders both approved cuts from a config. No rendered video, poster or customer data is included in this branch.

Automatic Vercel deployment for `preview/sparkleclean-commercial-20261027` is disabled in `vercel.json`. The demo path permits same-origin framing; other paths retain their existing framing policy. No merge or deployment is part of this change.

The revised customer message supplies the layout and timing: three floors, mostly open plan, from 6pm Monday to Friday. Reply cards repeat the customer name and leave enough scroll space to show the complete draft without fragments from neighbouring cards. The 35-second end card lasts four seconds; the 15-second end card lasts 3.5 seconds. In the short cut, Checked chips precede the checked caption and the tracker row precedes the logged caption.
