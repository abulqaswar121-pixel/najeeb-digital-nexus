<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## Project rules (NDH Agency site)

- **Agency-only surfaces.** The header and the footer carry NDH Agency's own
  destinations only. Do not add an ecosystem switcher, sibling/parent-gateway
  promotion, or an Academy cross-promotion block — these were deliberately
  removed at the client's request.
- **Agency-only header nav.** Services, Case Studies, How It Works, Talent
  Network, Insights, Contact + the "Start a Project" CTA. Nothing else.
- **No floating install UI.** There is no PWA install button or modal;
  `public/manifest.webmanifest` remains for browser-initiated installs.
- **Design system.** Follow the Precision Gateway system documented in
  README ("Design system"). Alternate the navy/porcelain/white band rhythm —
  this project is intentionally _not_ an all-dark theme.
- **No fabricated data.** Case studies, clients, testimonials and metrics must
  stay real and verifiable.
- **Keep it green.** `npm run typecheck`, `npm run lint`, `npm run test` and
  `npm run build` must pass before pushing; CI runs the same pipeline.
