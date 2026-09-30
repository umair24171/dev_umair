# Publishing review

The blog agent is manual-only and writes to `content/drafts/`. It cannot commit posts, cross-post or notify external channels. Drafts do not appear in the website or sitemap.

Before moving a draft to `content/posts/`, a human reviewer must:

- Verify factual/model/version claims against primary sources and record the links.
- Confirm first-person experiences with Umair and obtain permission for client information.
- Supply evidence, conditions and dates for every performance, cost and business-result claim.
- Run executable code, or clearly identify an illustrative example and its limitations.
- Check actual commercial destinations; never publish template links.
- Confirm title, excerpt, publication date, applicable updates and one H1 supplied by the template.

Set `status: published`, `reviewed: true`, and an accurate `updated` date after review. Existing articles without `reviewed: true` carry an archive notice. The two articles with confirmed model/code problems are `status: review`; their originals remain recoverable in the repository but are not served or listed.

Do not equate a percentage expression with a verified result, a generated outline with firsthand experience, or a successful syntax check with production validation.
