# Homepage studio presentation

The approved full-homepage design uses forest/graphite surfaces and mint accents, with two generated illustrative photographs. They depict workflow planning and field mapping; they are not real client engagements, product screenshots or evidence of results. Visible captions and alt text identify the illustrations.

- `public/home-studio/workflow-planning.webp`: 1536 × 1024. An inquiry workflow is mapped through field checks, a prepared reply and human review. It is an illustrative planning scene based on the inquiry sample, not an added live capability.
- `public/home-studio/field-mapping.webp`: 1536 × 1024. Source fields are mapped to destination records with a missing-value note. It illustrates defining the mapping before connecting tools.

Both were generated with the built-in ImageGen tool and optimized as WebP. Next Image provides responsive delivery; the hero loads eagerly and the services photograph loads lazily. The actual founder photograph, portfolio cover illustrations and project evidence screenshots are unchanged.

Homepage components use scoped CSS modules. `app/home-studio.css` targets the homepage route marker to style the shared header/footer and existing founder, FAQ and contact markup only on the homepage. Styles cannot leak into other routes after client navigation because every selector requires `main[data-home-studio]` to be present. No new client JavaScript is needed.

The Business tasks portfolio section retains its markup, content source, image assets, component and styles. The rest of the homepage retains factual commitments, service destinations, FAQ answers, pilot exclusions and cost boundaries. Existing mobile navigation, analytics controls and contact behavior are reused without changes to handlers or backend behavior.
