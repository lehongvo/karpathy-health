# karpathy-health — PersonalOS

> Sustainable productivity OS for a multi-tasking dev (backend + Solana/Rust + interview prep), built with citation-backed protocols and a Karpathy-minimal Next.js dashboard.

**Sister repo**: [karpathy-rust](https://github.com/lehongvo/karpathy-rust) — strategic plan + dashboard for the Rust/Solana career goal. The two share a design system and link to each other.

---

## What this is

A **two-layer operating system** for a developer juggling multiple jobs without burning out:

1. **Strategy layer** ([`/docs`](./docs)) — a research-backed framework: first principles, energy/attention/task protocols, failure-recovery procedures. Every non-trivial claim cites primary peer-reviewed sources (Van Dongen, Erickson, Drake, Mark, Newport, etc.). Walker's *Why We Sleep* claims and cold-shower-as-cognition-hack are explicitly **debunked** — see [`docs/05-anti-patterns.md`](./docs/05-anti-patterns.md).
2. **Dashboard layer** ([`/web`](./web)) — a Next.js 15 + Tailwind v4 + shadcn/ui app for daily-driver use (~5 min/day):
   - Daily MIT + energy slider
   - Sleep / exercise / nutrition tracking
   - Deep work timer with distraction logging
   - Project status board (max 2 active enforced)
   - Auto-detected correlations (sleep ↔ deep work, etc.)
   - Burnout alerts triggered by data-driven rules
   - 100% local (IndexedDB); no backend, no auth, no analytics

Built once, used for years.

---

## Read in this order

1. [`docs/00-philosophy.md`](./docs/00-philosophy.md) — manifesto
2. [`docs/01-first-principles.md`](./docs/01-first-principles.md) — the 7 universal principles
3. [`docs/02-energy-protocol.md`](./docs/02-energy-protocol.md) — sleep / exercise / nutrition
4. [`docs/03-attention-protocol.md`](./docs/03-attention-protocol.md) — deep work
5. [`docs/04-failure-recovery.md`](./docs/04-failure-recovery.md) — when something slips
6. [`docs/05-anti-patterns.md`](./docs/05-anti-patterns.md) — what NOT to do (with citations)
7. [`docs/06-tldr.md`](./docs/06-tldr.md) — 5 habits Pareto
8. [`docs/07-next-7-days.md`](./docs/07-next-7-days.md) — concrete week-1 plan
9. [`docs/08-framework-comparison.md`](./docs/08-framework-comparison.md) — Deep Work / GTD / PARA / Pomodoro / etc.
10. [`docs/cadence.md`](./docs/cadence.md) — daily / weekly / monthly / quarterly loops
11. [`docs/diagnosis.md`](./docs/diagnosis.md) — self-assessment + hidden-cost research
12. [`docs/decision-log.md`](./docs/decision-log.md) — track non-obvious system pivots

---

## Setup

Requires Node 18+ and **pnpm**.

```bash
git clone https://github.com/lehongvo/karpathy-health.git
cd karpathy-health/web
pnpm install
pnpm dev
```

Open <http://localhost:3000>. The dashboard seeds 30 days of dummy data on first open so it's not empty.

### Verifying the build

```bash
pnpm typecheck   # zero errors expected
pnpm build       # production build
```

---

## Tech stack

- **Next.js 15.1.8** App Router (RSC default)
- **TypeScript** strict mode
- **Tailwind CSS v4** (CSS-first config via `@theme`)
- **shadcn/ui** new-york style, `cssVariables: true`
- **IndexedDB** via [`idb`](https://github.com/jakearchibald/idb) — all data local
- **Recharts** for charts; **next-mdx-remote** for protocol docs
- **next-themes** (dark default); **framer-motion** (used sparingly)
- **No backend, no database server, no auth, no telemetry**

---

## Privacy-first principles

- All data lives in your browser's IndexedDB.
- No analytics tracking (Google Analytics, Mixpanel, etc.).
- Export/Import via JSON file (you own your data — Insights → Export JSON).
- Single-user app; no accounts.
- Roadmap: optional encrypt with passphrase (v3).

---

## Cross-repo integration with karpathy-rust

`/learning` accepts a JSON paste with the karpathy-rust progress (Option A from the spec):

```json
{
  "hoursThisWeek": 4.5,
  "hoursThisMonth": 18,
  "hoursTotal": 120,
  "currentMonthFocus": "M3 — Ownership"
}
```

Stored in localStorage. The next iteration can switch to Option B (Vercel subdomain shared deployment) once both apps are stable.

---

## Roadmap (not yet built)

- v2: Apple Health / Oura / Whoop import
- v2: Anki-lite spaced repetition for Rust concepts
- v3: Optional IndexedDB encryption (password-derived key)
- v3: AI-assisted weekly review (Claude API summarizes insights)
- v3: Public profile to share streaks (opt-in)
- v4: iOS app (React Native, share code with web)

---

## Tone

Thẳng thắn (frank). Cites research. Avoids hustle culture AND soft culture. If a popular practice has weak evidence (cold showers, blue-light glasses), it's called out — see [`docs/05-anti-patterns.md`](./docs/05-anti-patterns.md).

---

## License

MIT — use it, fork it, ship your own version.

## Credits

- Built using [Claude Code](https://claude.ai/code) under two operating-principle skills: **Karpathy guidelines** (surgical, simplicity-first) and **research discipline** (≥2 sources/claim, no memory-only answers).
- All citations verified during build via parallel WebSearch + PubMed/PMC/PNAS lookup.
