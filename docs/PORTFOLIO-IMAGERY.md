# Recorded project output captures

The four agent portfolio images are screenshots of plain viewers containing exact Docker stdout excerpts from the linked successful GitHub Actions jobs. Original timestamps and Docker prefixes are preserved. There is no simulated terminal prompt, command text, customer interface or invented output.

The source logs were retrieved through the GitHub connector on 26 October 2026. Removing only each timestamp and Docker prefix produces a byte-for-byte match with the existing recorded output in content/business/agent-projects.json. Project metrics and implementation claims were not changed.

Sources and excerpt SHA-256 hashes are recorded in [recorded-runs/provenance.json](recorded-runs/provenance.json). The original excerpt files are alongside that manifest. Each project page links to its original CI job.

Run `node scripts/capture-recorded-runs.mjs` after installing the existing Playwright Chromium browser to reproduce the images from the archived logs. The script verifies excerpt hashes, exact recorded output and that every rendered line fits before capturing each 1600 by 900 PNG.

Images are in public/images/agent-portfolio/recorded-{slug}.png. The generated conceptual imagery was replaced. Legacy cover URLs serve lossless WebP copies of the recorded captures for compatibility. These captures document recorded CLI behavior, not a live hosted product or client outcome.
