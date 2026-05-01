# Automation

This repo runs three independent automations. Each is documented here so future-you (or a new contributor) can audit, disable, or rebuild them without spelunking commit history.

---

## Quick map

| Automation | Where it lives | Cadence | What it does |
|---|---|---|---|
| **Vercel auto-deploy** | Vercel Git integration | Every push to `main` | Builds `web/` and `karpathy-health/` projects, promotes to production |
| **Dependabot + auto-merge** | `.github/dependabot.yml` + `.github/workflows/auto-merge.yml` | Weekly Monday 02:00 UTC | Opens PRs for npm + GitHub Actions updates, auto-squash-merges semver-patch and semver-minor |
| **Remote agent routines** | claude.ai/code (cloud) | Daily + one-off | Daily data scan (jobs/research/CVE/ecosystem) + scheduled health checks |

---

## A. Vercel deployment

### Setup state

- **Scope**: `lehongvi19xgmailcoms-projects`
- **Two Vercel projects** linked to this repo:
  - `web` — root dir `web/` (the Next.js app)
  - `karpathy-health` — root dir `/` (full repo; same `web/` build settings, secondary alias)
- **Production aliases**:
  - `https://web-taupe-three-65.vercel.app` (primary)
  - `https://karpathy-health.vercel.app`

### How it deploys

Push to `main` → Vercel webhook fires → Vercel runs the build defined in each project's settings (`pnpm install` + `pnpm build` from `web/`). On success: promotes to production and updates aliases. On failure: deploy state = Error, last successful production stays live.

### Manual deploy from local

Use the `vercel-deploy` skill:

```bash
# preconditions: VERCEL_TOKEN in env, vercel CLI installed
vercel --prod --token="$VERCEL_TOKEN" --yes --scope lehongvi19xgmailcoms-projects
```

The skill handles auto-commit, link, retry on transient errors, and reports the production URL. See [`.claude/skills/vercel-deploy/SKILL.md`](../.claude/skills/vercel-deploy/SKILL.md).

### Known gotchas

- **Next.js CVE block**: Vercel rejects deployment if `next` is on a known-vulnerable version. Bump to the latest patched 15.x line (currently `15.5.15`+) and redeploy.
- **`next-mdx-remote` CVE block**: same rule — keep on `>=6.0.0`.
- **Major Dependabot bumps may break peer deps**: e.g. `@next/mdx@16` requires `next@16`. If a Dependabot major lands and breaks build, revert and pin.

---

## B. Dependabot + auto-merge

### Configuration

`.github/dependabot.yml` — weekly schedule, Monday 02:00 UTC, two ecosystems:

| Ecosystem | Directory | Group | Limit |
|---|---|---|---|
| `npm` | `/web` | `patch-and-minor` (single grouped PR) | 5 open PRs |
| `github-actions` | `/` | (per-action) | unlimited |

Both label PRs `auto-merge` + `dependencies`/`ci` and use `chore(deps)` / `chore(ci)` commit prefix.

### Auto-merge gate

`.github/workflows/auto-merge.yml` — runs on every PR opened/synchronized. Conditions for auto-merge:

1. PR author is `dependabot[bot]`
2. `dependabot/fetch-metadata` reports update type is `semver-patch` OR `semver-minor`
3. `gh pr merge --auto --squash` is enabled (queues until checks pass)

**Major updates are NEVER auto-merged.** They open as PRs labeled `auto-merge` (the label is misleading for majors — it's just the routing label) but the workflow's conditional skips them. A human must review and merge.

### Required CI gate

`.github/workflows/ci.yml` runs `pnpm typecheck` + `pnpm build` on every PR. Auto-merge waits for this to pass before merging. If CI fails on a Dependabot PR, the PR sits open until a human investigates.

---

## C. Remote agent routines

These are Claude Code routines hosted in Anthropic's cloud, configured per-account at https://claude.ai/code/routines. They clone this repo via the Claude GitHub App and run a sandboxed Sonnet 4.6 session against the listed prompt.

### C.1 Daily data scan

- **Routine ID**: `trig_01NQN7Ej9xjB3emyezC576cC`
- **Manage**: https://claude.ai/code/routines/trig_01NQN7Ej9xjB3emyezC576cC
- **Cron**: `0 23 * * *` UTC (06:00 Asia/Saigon daily)
- **Allowed tools**: `Bash`, `Read`, `Write`, `Edit`, `WebFetch`

**What it does each day:**

1. Scan four sources:
   - **Jobs** — cryptojobslist.com, web3.career, solanacompass.com (top 10 remote Rust/Solana/web3 each)
   - **Research** — Cal Newport, Karpathy, DHH (latest 5 posts each via RSS)
   - **CVE / dep updates** — `npm view next | next-mdx-remote | @next/mdx` + Next.js GitHub security advisories
   - **Ecosystem** — `@solana/web3.js`, `@coral-xyz/anchor`, solana-labs/solana releases
2. Write to `data/scan-YYYY-MM-DD.json`
3. Diff vs yesterday's file. If identical (excluding timestamp), exit no-op.
4. Otherwise: branch `chore/scan-YYYY-MM-DD` → push → open PR → `gh pr merge --auto --squash`. Falls back to `--admin` immediate squash if auto-merge unavailable.

**Why `data/` lives at repo root (not `web/`)**: keeps it out of the Next.js build → Vercel does not redeploy on data-only commits. Commit message also includes `[skip-vercel]` as a marker.

### C.2 Vercel health check (one-shot)

- **Routine ID**: `trig_01DKLAabFohmYrahFtfJE3rQ`
- **Manage**: https://claude.ai/code/routines/trig_01DKLAabFohmYrahFtfJE3rQ
- **Run-once**: `2026-05-03T02:00:00Z` (auto-disables after firing)
- **Allowed tools**: `Bash`, `Read`, `WebFetch`

**What it does once:**

1. HTTP-checks 12 endpoints across two production URLs (`/`, `/track`, `/insights`, `/review`, `/setup`, `/protocols/00-philosophy` × 2 base URLs).
2. Queries `vercel ls --token=$VERCEL_TOKEN` for last 3 deploy states.
3. Compares pinned versions (`next 15.5.15`, `next-mdx-remote 6.0.0`, `@next/mdx 15.5.15`) against latest published.
4. Reports a 12-line summary: uptime / last 3 deploys / version drift / action items.

**Note**: the `VERCEL_TOKEN` is embedded in the routine prompt because the cloud sandbox does not have access to local env. To rotate the token, update the routine via the management URL.

### Setup requirements (one-time)

For the routines to actually run, the following must already be in place:

1. **Claude GitHub App** installed on `lehongvo/karpathy-health` — https://github.com/apps/claude → Install → select repo. Without this, the cloud agent cannot clone or push.
2. **`Allow auto-merge`** enabled on the repo — Settings → General → "Pull Requests" → check "Allow auto-merge". The data-scan routine falls back to `--admin` immediate squash if this is off, but auto-merge is the cleaner path.
3. **`VERCEL_TOKEN`** for any routine that calls `vercel` CLI — paste into the routine prompt (cloud agents cannot read your local `~/.zshrc`).

---

## D. Operating the system

### Inspect routines

```bash
# Via web UI
open https://claude.ai/code/routines

# Or via CLI within Claude Code session
# (use RemoteTrigger tool: list / get / run / update)
```

### Trigger a routine manually

Open the routine page → click "Run now". Or in a Claude Code session:

> Run trigger `trig_01NQN7Ej9xjB3emyezC576cC` now via RemoteTrigger.

### Disable a routine

Open the routine page → toggle Enabled OFF. (You cannot delete routines via API; toggle is the kill switch.)

### Audit Dependabot

```bash
gh pr list --label dependencies --state all --limit 20
```

### Force a Vercel rebuild

```bash
git commit --allow-empty -m "ci: trigger Vercel auto-deploy verification"
git push
```

---

## E. Failure modes and recovery

### Vercel build fails after Dependabot merge

1. `git revert <commit>` the offending bump on `main`
2. `git push`
3. Pin the package in `web/package.json` to the last-known-good version (remove the `^` prefix)
4. Open a Dependabot ignore directive in `dependabot.yml` if the package is repeatedly problematic

### Routine's PR stays open (CI fails)

CI failure = build broken. Fix the root cause in `web/`, push to `main`, then close the stale PR. Auto-merge will not bypass a failing required check.

### GitHub App permission revoked

Cloud routine logs will show 401/403 on `git push`. Re-install at https://github.com/apps/claude. Permissions take ~30s to propagate.

### `VERCEL_TOKEN` expired

Health-check routine will report `auth error` in its summary. Generate a new token at https://vercel.com/account/tokens, then update the routine prompt via its management URL.

---

## What this document does NOT cover

- The PersonalOS philosophy, protocols, or dashboard implementation — see [`00-philosophy.md`](./00-philosophy.md), [`02-energy-protocol.md`](./02-energy-protocol.md), and the `web/` source.
- Local Claude Code skills (`vercel-deploy`, `karpathy-guidelines`, `research`) — see `.claude/skills/`.
- The sister repo `karpathy-rust` — same automation patterns can apply, but the routines and Dependabot config are not shared.
