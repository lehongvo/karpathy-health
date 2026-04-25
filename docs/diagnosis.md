# Diagnosis — Where am I now?

Self-assessment for the multi-tasking dev. **5-7 anti-patterns + 10-question audit + research-backed hidden costs.**

---

## A. The 7 anti-patterns of multi-job devs

### 1. The "always-on" Slack hero

**Pattern**: ≤5 min response time on every Slack message. Reputation: helpful. Cost: zero deep work blocks survive intact.

**Hidden cost**: Mark 2008 — ~23 min average to resume after each interruption ([PDF](https://ics.uci.edu/~gmark/chi08-mark.pdf)). 8 Slack pings/day × 23 min = 3+ hours of effective deep-work time evaporated.

### 2. The "hustle through it" sleep deferrer

**Pattern**: 5-6h sleep on weekdays, "catch up on weekend." Believes it works because *feels* fine.

**Hidden cost**: Van Dongen 2003 — 14 nights at 6h TIB = cognitive performance equivalent to 2 nights of total sleep deprivation, with subjects unaware ([PubMed](https://pubmed.ncbi.nlm.nih.gov/12683469/)). Belenky 2003: weekend recovery is partial. You don't get the hours back.

### 3. The "more projects = more leverage" overloader

**Pattern**: 4-7 active commitments simultaneously. Feels like leverage. Is actually pure context-switching tax.

**Hidden cost**: Per `MAX_ACTIVE_PROJECTS = 2` rule. Every project past the second steals time from every other project. The math compounds against you.

### 4. The "gear acquisition" optimizer

**Pattern**: New Notion template every 2 weeks. New time-tracking app every month. Cal Newport book → Tiago Forte book → Andy Matuschak essays — endless reading about productivity.

**Hidden cost**: Every hour reading about productivity is an hour not doing the work. The system you use is better than the system you don't.

### 5. The "productivity porn" consumer

**Pattern**: r/productivity, ⌗productivity YouTube, "morning routine" videos at lunchtime. Self-reinforcing loop.

**Hidden cost**: Same as #4, plus the dopamine of *feeling productive* without producing.

### 6. The "skills compound, so I'll skip exercise this month" rationalizer

**Pattern**: Exercise feels like a tax that doesn't compound. Drops it under deadline pressure.

**Hidden cost**: Erickson 2011 PNAS: 3×/wk × 40min walks → +2% hippocampal volume + BDNF gains ([source](https://www.pnas.org/doi/10.1073/pnas.1015950108)). You're trading future cognitive capacity for present hours, and the trade is bad.

### 7. The "I'll start the system after this crunch" perpetual deferrer

**Pattern**: "Just one more crunch" every quarter. The system never starts.

**Hidden cost**: Per Tulili 2023 SE burnout review ([source](https://www.sciencedirect.com/science/article/pii/S0950584922002257)) — exhaustion is the modal outcome, leading to turnover or chronic underperformance. The crunch IS the system, and the system is unsustainable.

---

## B. 10-question self-assessment

For each, score 1 (always true) to 5 (never true). **Lower = worse**.

| # | Question | Score (1-5) |
|---|---|---|
| 1 | I sleep ≥7h on at least 5 of 7 nights. | ___ |
| 2 | I have a hard caffeine cutoff at least 8h before my intended bedtime. | ___ |
| 3 | I do ≥1 uninterrupted 90-min deep work block per day, ≥4 days/week. | ___ |
| 4 | I have notifications fully off during deep work blocks (Slack, email, phone). | ___ |
| 5 | I exercise (≥30 min, conversational pace) at least 3×/week. | ___ |
| 6 | I have ≤2 active projects/commitments at any time. | ___ |
| 7 | I do a Sunday review of my week, ≥30 min, every week. | ___ |
| 8 | I set tomorrow's Most Important Task before bed. | ___ |
| 9 | I say "no" to optional tasks/meetings that don't move my top goals forward. | ___ |
| 10 | I check Slack/email at most 2-3 batched windows per day, not continuously. | ___ |

**Scoring**:

- **40-50**: System is largely running. Tune at the margins.
- **30-39**: 2-3 major leaks. Fix the lowest-scored one this week.
- **20-29**: Most layers leaking. Start with `07-next-7-days.md`.
- **&lt;20**: System hasn't started. Begin Day 1 of the 7-day plan today.

---

## C. Hidden costs (research-backed)

| Cost | Quantification | Source |
|---|---|---|
| Sleep restriction (14d × 6h) | = 2 nights total deprivation, undetected by self | [Van Dongen 2003](https://pubmed.ncbi.nlm.nih.gov/12683469/) |
| Single interruption | ~23 min avg resumption time | [Mark 2008](https://ics.uci.edu/~gmark/chi08-mark.pdf) |
| Sleep-deprived dev coding | ~50% drop in implementation quality | [Fucci 2018](https://arxiv.org/abs/1805.02544) |
| 12 months no aerobic exercise | Loss of 1-2 years equivalent of hippocampal volume | [Erickson 2011](https://www.pnas.org/doi/10.1073/pnas.1015950108) |
| Caffeine 6h before bed (400mg) | >1h reduction in total sleep time | [Drake 2013](https://pmc.ncbi.nlm.nih.gov/articles/PMC3805807/) |
| Unstable team priorities | ~40% increased burnout in DORA cohorts | [DORA 2024](https://dora.dev/research/2024/dora-report/) |
| Lifetime burnout prevalence in devs | ~73% (industry survey) | [JetBrains 2023](https://www.jetbrains.com/lp/devecosystem-2023/) |

---

## What this diagnosis is NOT

- **Not a personality test.** No "you're a Maker, not a Manager." Behavior, not identity.
- **Not a comparison to others.** The benchmark is *future you*, not other devs.
- **Not actionable on its own.** The diagnosis tells you which protocol page to start on.

After scoring, go to:
- Sleep low → [`02-energy-protocol.md`](./02-energy-protocol.md) §A
- Deep work low → [`03-attention-protocol.md`](./03-attention-protocol.md)
- Exercise low → [`02-energy-protocol.md`](./02-energy-protocol.md) §B
- Multi-project overload → [`04-failure-recovery.md`](./04-failure-recovery.md) failure mode 4
- Multiple low → [`07-next-7-days.md`](./07-next-7-days.md) (start over)
