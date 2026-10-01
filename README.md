# Najeeb Digital Nexus

I want to go code @project:9789b85d-b379-4213-9185-d84f8dddee41:"Najeeb Digital Hub" this from scratch at arena.ai but this time it will have agency separate and academy separate but having reference of each other maybe in footer so I will have subdomain for each agency.ndh.com.ng and academy.ndh.com.ng... all I want is that you give it all the ideas of how the agency should be from client to admin to pm, talents, invitations, my case studies, links, and so many other features agency have nd let it even suggest some let it design everything from head to toes just give it te tools to use because i will sync back to you through github.... no need of telling it how to design it just tell it to design a perfect professional modern mind blowing website worth trillion dollars that anyone that sees it fall for it, alsoo creating previws and demos first....

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1fa1b8b7-0e3e-45c2-aeeb-ae329081a887).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

**Package manager:** `npm` is canonical for this repo — `package-lock.json` is
the committed lockfile and is what CI installs from. A `bunfig.toml` is kept
for compatibility with Lovable's own hosted editor/sync pipeline, but it
should not be used for local development or CI; a previously-committed
`bun.lock` has been removed to avoid two lockfiles silently drifting apart.

### Available scripts

```sh
npm run dev        # start the Vite dev server
npm run build      # production build (outputs to .output/)
npm run preview    # preview a production build locally
npm run typecheck  # tsc --noEmit
npm run lint       # eslint .
npm run format     # prettier --write .
npm run test       # vitest unit tests (business-logic modules)
npm run test:e2e   # playwright end-to-end tests (requires `npx playwright install`)
```

### Environment variables

See `.env.example`. Currently the only variable the app reads is
`VITE_PAYSTACK_PUBLIC_KEY`, used by the sandboxed payment demo
(`src/components/payment/PaystackPaymentModal.tsx`). There is no backend in
this repository yet (see `AUDIT_REPORT.md`), so no server-side secrets are
required today — that will change as soon as a real backend/payment
integration is added.

### Continuous integration

`.github/workflows/ci.yml` runs on every push/PR: install → typecheck → lint
→ unit tests → production build. Playwright e2e tests are defined but are run
manually/locally for now (see `playwright.config.ts`) since this sandbox
cannot install browser system dependencies; add an e2e CI job once a host
with full package-manager access runs this pipeline.
