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

`npm run dev` now starts **both** the frontend (Vite, port 3000) and the real
backend API (Express, port 8787) concurrently — see "Architecture: frontend +
backend" below. The browser only ever talks to same-origin `/api/*`, which
Vite proxies to the API process.

**Package manager:** `npm` is canonical for this repo — `package-lock.json` is
the committed lockfile and is what CI installs from. A `bunfig.toml` is kept
for compatibility with Lovable's own hosted editor/sync pipeline, but it
should not be used for local development or CI; a previously-committed
`bun.lock` has been removed to avoid two lockfiles silently drifting apart.

### Architecture: frontend + backend

This used to be a client-only app (all "data" lived in browser localStorage,
auth was unenforceable). It now has a real backend:

- **`src/`** — the React/TanStack Start frontend, built with Vite.
- **`server/`** — a standalone Express API (`server/index.ts`), with:
  - Real authentication: bcrypt-hashed passwords, signed httpOnly session
    cookies (`server/auth.ts`) — sessions can no longer be forged by writing
    to `localStorage`.
  - A simple file-backed data store (`server/db.ts`,
    `server/data/*.json` — gitignored, auto-seeded with demo data on first
    boot). Swapping this for a real Postgres/SQLite database later is a
    contained change, since every route only goes through the
    `Collection<T>`/`SingletonRecord<T>` API in `server/db.ts`.
  - Role-gated REST endpoints under `/api/*` (see `server/routes/`) for
    talents (public-safe vs. internal split), briefs, consultation requests,
    talent applications, transactions, referrals, payouts (real two-person
    maker-checker), and project/milestone QA approval.
  - A real Paystack server-side verification + webhook path
    (`server/paystack.ts`, `server/routes/payments.ts`) — degrades honestly
    to an explicit "sandbox" result when no `PAYSTACK_SECRET_KEY` is set,
    rather than pretending to verify a payment it never checked.
- In production, this app needs to be deployed as two coordinated pieces (the
  static/SSR frontend, and the Node API process) with a reverse proxy routing
  `/api/*` to the API — this repo does not yet include that deployment
  config, only the working local dev setup.

### Available scripts

```sh
npm run dev             # start BOTH the Vite dev server and the API server
npm run dev:web         # start only the Vite dev server
npm run server:dev      # start only the API server (tsx watch)
npm run build           # production build of the frontend (outputs to .output/)
npm run preview         # preview a production build locally
npm run typecheck       # tsc --noEmit (frontend)
npm run typecheck:server # tsc --noEmit (server/, separate tsconfig)
npm run lint            # eslint .
npm run format          # prettier --write .
npm run test            # vitest (frontend unit tests + server integration tests)
npm run test:e2e        # playwright end-to-end tests (requires `npx playwright install`)
```

### Environment variables

See `.env.example`. Copy it to `.env` for local development (already
gitignored). Key variables:

- `SESSION_SECRET` — signs the auth cookie. Auto-generated per-process if
  unset (fine for a quick local run; every restart invalidates sessions).
  **Must** be set to a real, stable secret anywhere this is actually deployed.
- `PAYSTACK_SECRET_KEY` — server-only, enables real payment verification.
  Without it, the payment flow still works end-to-end but is honestly
  labeled as a sandbox simulation.
- `VITE_PAYSTACK_PUBLIC_KEY` — the only client-side (`VITE_*`) variable;
  used by the Paystack Inline popup.

### Continuous integration

`.github/workflows/ci.yml` runs on every push/PR: install → typecheck → lint
→ unit tests → production build. Playwright e2e tests are defined but are run
manually/locally for now (see `playwright.config.ts`) since this sandbox
cannot install browser system dependencies; add an e2e CI job once a host
with full package-manager access runs this pipeline.
